import { register as registerData } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Define the validation schema using zod with conditional validation
const schema = z.object({
  userName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").max(10,"Phone can container 10 digits"),
  address: z.string().min(1, "Address is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  profileImage: z.custom((file) => file instanceof File, {
    message: "Profile image is required",
  }),
}).superRefine((data, ctx) => {
  if (data.role === "Auctioneer") {
    if (!data.bankAccountName || data.bankAccountName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank Account Name is required for Auctioneers",
        path: ["bankAccountName"],
      });
    }
    
    if (!data.bankAccountNumber || data.bankAccountNumber.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank Account Number is required for Auctioneers",
        path: ["bankAccountNumber"],
      });
    }
    
    if (!data.bankName || data.bankName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank Name is required for Auctioneers",
        path: ["bankName"],
      });
    }
    
    
    
  }
});

const SignUp = () => {
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const role = watch("role");
  const handleRegister = (data) => {
    
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        // For Bidder role, skip payment fields if they're empty
        if (data.role === "Bidder" && 
            ["bankAccountName", "bankAccountNumber", "bankName"].includes(key) &&
            (!value || value === "")) {
          return; // Skip empty payment fields for Bidders
        }
        
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      dispatch(registerData(formData));
    } catch (error) {
      console.error("Error in handleRegister:", error);
    }
  };

  // Add error handler for form submission
  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("Selected file:", file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setValue("profileImage", file, { shouldValidate: true });
    };
  };

  // Common class names object
  const classNames = {
    input: "text-sm py-2 px-3 border rounded-md focus:outline-none focus:ring-2 ",
    error: "text-red-500 text-xs",
    label: "text-sm text-gray-600",
    container: "flex flex-col sm:flex-1 mx-2",
  };

  const bankOptions = [
    "Meezan Bank",
    "UBL",
    "HBL",
    "Allied Bank",
  ];

  return (
    <>
       <section className="w-full ml-0 m-0 px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
          <h1 className="text-[#d6482b] text-6xl font-bold mb-4">Register</h1>

          <form 
            className="flex flex-col gap-6 w-full" 
            onSubmit={handleSubmit(handleRegister, onError)}
          >
            <p className="font-semibold text-xl text-gray-700">Personal Details</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className={classNames.container}>
                <label className={classNames.label}>Full Name</label>
                <input
                  type="text"
                  {...register("userName")}
                  className={`${classNames.input} ${errors.userName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.userName && <p className={classNames.error}>{errors.userName.message}</p>}
              </div>
              <div className={classNames.container}>
                <label className={classNames.label}>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`${classNames.input} ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className={classNames.error}>{errors.email.message}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className={classNames.container}>
                <label className={classNames.label}>Phone</label>
                <input
                  type="text"
                  {...register("phone")}
                  className={`${classNames.input} ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  maxLength={11}
                />
                {errors.phone && <p className={classNames.error}>{errors.phone.message}</p>}
              </div>
              <div className={classNames.container}>
                <label className={classNames.label}>Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className={`${classNames.input} ${errors.address ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.address && <p className={classNames.error}>{errors.address.message}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className={classNames.container}>
                <label className={classNames.label}>Role</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`${classNames.input} flex justify-between items-center ${errors.role ? "border-red-500" : "border-gray-300"}`}
                      style={{ width: "100%" }}
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      aria-label="Select Role"
                    >
                      {watch("role") || "Select Role"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={4}
                    className="w-full bg-white border border-gray-300 rounded-md shadow-lg p-1"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer text-gray-700 hover:bg-[#d6482b] hover:text-white rounded-md px-3 py-1"
                      onClick={() => setValue("role", "Auctioneer", { shouldValidate: true })}
                    >
                      Auctioneer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-gray-700 hover:bg-[#d6482b] hover:text-white rounded-md px-3 py-1"
                      onClick={() => setValue("role", "Bidder", { shouldValidate: true })}
                    >
                      Bidder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.role && <p className={classNames.error}>{errors.role.message}</p>}
              </div>
              <div className={classNames.container}>
                <label className={classNames.label}>Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className={`${classNames.input} ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.password && <p className={classNames.error}>{errors.password.message}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-1 gap-2">
              <label className={classNames.label}>Profile Image</label>
              <div className="flex items-center gap-3">
                <img
                  src={profileImagePreview ? profileImagePreview : "/imageHolder.jpg"}
                  alt="profileImagePreview"
                  className="w-14 h-14 rounded-full border border-gray-300 object-cover"
                />
                <input 
                  type="file" 
                  onChange={imageHandler} 
                  className="text-sm"
                  accept="image/*"
                />
              </div>
              {errors.profileImage && <p className={classNames.error}>{errors.profileImage.message}</p>}
            </div>
            
            {role === "Auctioneer" && (
              <div className="flex flex-col gap-6 pt-4 border-t border-gray-200">
                <label className="font-semibold text-xl text-gray-700 flex flex-col mb-4">
                  Payment Method Details
                  <span className="text-xs text-gray-500 font-normal mt-1">
                    Fill Payment Details Only If you are registering as an Auctioneer
                  </span>
                </label>
                <div className="flex flex-col gap-2">
                  <label className={classNames.label}>Bank Details</label>
                  <div className={`${classNames.container} gap-4`}>
                  <div className={classNames.container}>
               
                <input
                  type="text"
                  {...register("bankName")}
                  className={`${classNames.input} ${errors.bankName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Bank Name"
                />
                {errors.bankName && <p className={classNames.error}>{errors.bankName.message}</p>}
              </div>
              <div className={classNames.container}>
                    <input
                      type="text"
                      {...register("bankAccountNumber")}
                      placeholder="Account Number"
                      className={`${classNames.input} sm:flex-1 ${errors.bankAccountNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.bankAccountNumber && <p className={classNames.error}>{errors.bankAccountNumber.message}</p>}
</div>
<div className={classNames.container}>
                    <input
                      type="text"
                      {...register("bankAccountName")}
                      placeholder="Account Holder Name"
                      className={`${classNames.input} sm:flex-1 ${errors.bankAccountName ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.bankAccountName && <p className={classNames.error}>{errors.bankAccountName.message}</p>}
                  </div>
                </div>
                </div>

              
              </div>
            )}

            <button
              className="bg-[#d6482b] w-full font-semibold hover:bg-[#b8381e] transition-all duration-300 text-lg py-2 rounded-md text-white mt-4"
              type="submit"
              disabled={loading}
              onClick={() => console.log("Button clicked!")} // Debug log
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;