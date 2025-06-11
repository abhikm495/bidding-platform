import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("1. Function started");

    console.log("2. Request files:", req.files);
    console.log("3. Request body:", req.body);

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("4. No files found");
      return next(new ErrorHandler("Profile Image Required.", 400));
    }
    console.log("5. Files check passed");
    
    const { profileImage } = req.files;
    console.log("6. Profile image extracted");
    
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    console.log("7. Mimetype:", profileImage.mimetype);
    if (!allowedFormats.includes(profileImage.mimetype)) {
      console.log("8. Format not allowed");
      return next(new ErrorHandler("File format not supported.", 400));
    }
    console.log("9. Format check passed");

    const {
      userName,
      email,
      password,
      phone,
      address,
      role,
      bankAccountNumber,
      bankAccountName,
      bankName,
    } = req.body;
    console.log("10. Body destructured");

    if (!userName || !email || !phone || !password || !address || !role) {
      console.log("11. Required fields missing");
      return next(new ErrorHandler("Please fill full form.", 400));
    }
    console.log("12. Basic fields check passed");
    
    if (role === "Auctioneer") {
      console.log("13. Role is Auctioneer, checking additional fields");
      if (!bankAccountName || !bankAccountNumber || !bankName) {
        console.log("14. Bank details missing");
        return next(
          new ErrorHandler("Please provide your full bank details.", 400)
        );
      }
      console.log("15. Bank details check passed");
      
    }
    console.log("20. Role-specific checks passed");

    console.log("21. About to check if user is registered");
    const isRegistered = await User.findOne({ email });
    console.log("22. DB query completed, isRegistered:", !!isRegistered);
    
    if (isRegistered) {
      console.log("23. User already registered");
      return next(new ErrorHandler("User already registered.", 400));
    }
    console.log("24. Registration check passed");

    console.log("25. About to upload to Cloudinary");
    console.log("26. Temp file path:", profileImage.tempFilePath);
    
    let cloudinaryResponse;
    try {
      console.log("27. Starting Cloudinary upload");
      cloudinaryResponse = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        {
          folder: "MERN_AUCTION_PLATFORM_USERS",
        }
      );
      console.log("28. Cloudinary upload completed");
      console.log("29. Cloudinary response received:", cloudinaryResponse.public_id);
    } catch (cloudinaryError) {
      console.error("30. Cloudinary upload error:", cloudinaryError);
      return next(
        new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
      );
    }
    console.log("31. Cloudinary try-catch block passed");

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "32. Cloudinary error:",
        cloudinaryResponse?.error || "Unknown cloudinary error."
      );
      return next(
        new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
      );
    }
    console.log("33. Cloudinary response check passed");

    console.log("34. About to create user");
    const user = await User.create({
      userName,
      email,
      password,
      phone,
      address,
      role,
      profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
      },
    });
    console.log("35. User created successfully:", user._id);

    console.log("36. About to generate token");
    generateToken(user, "User Registered.", 201, res);
    console.log("37. Token generated");
    
    console.log("38. Registration completed successfully");
  } catch (error) {
    console.error("39. ERROR in register function:", error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});
