import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "@/custom-components/Spinner";
import winEmail from "@/assets/win-email.svg"
import payment from "@/assets/payment.svg"
import placeBid from "@/assets/place-bid.svg"
import postBid from "@/assets/post-bid.svg"
import CardContent from "@/custom-components/CardContent";


const Home = () => {
  const howItWorks = [
  {
    title: "Post Items",
    icon: postBid,
    description: "Auctioneers can easily post items for bidding, showcasing their unique offerings to potential bidders.",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
  },
  {
    title: "Place Bids",
    icon: placeBid,
    description: "Bidders can place competitive bids on listed items, ensuring they have a chance to win their desired products.",
    color: {
      backGround: "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
  },
  {
    title: "Win Notification",
    icon: winEmail,
    description: "The highest bidder receives a winning email notification, confirming their successful bid and next steps.",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
  },
  {
    title: "Payment & Fees",
    icon: payment,
    description: "Once the auction concludes, the winning bidder processes payment, while the auctioneer receives their earnings minus a 5% fee.",
    color: {
      backGround: "linear-gradient(180deg, #4B83FF 0%, #6FA1FF 100%)",
      boxShadow: "0px 10px 20px 0px #BFD4FF",
    },
  },
];


  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div>
          <p className="text-[#DECCBE] font-bold text-xl mb-8">
            Transparency Leads to Your Victory
          </p>
          <h1
            className={`text-[#111] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Transparent Auctions
          </h1>
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Be The Winner
          </h1>
          <div className="flex gap-4 my-8">
            {!isAuthenticated && (
              <>
                <Link
                  to="/sign-up"
                  className="bg-[#d6482b] font-semibold hover:bg-[#b8381e] rounded-md px-8 flex items-center py-2 text-white  transition-all duration-300"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="text-[#DECCBE] bg-transparent border-2 border-[#DECCBE] hover:bg-[#fff3fd] hover:text-[#fdba88] font-bold text-xl  rounded-md px-8 flex items-center py-2 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">How it works</h3>
          <div className="grid grid-cols-2 gap-4 md:flex-row md:flex-wrap w-full">
            {howItWorks.map((element) => {
              return (
                 <CardContent {...element} />
              );
            })}
          </div>
        </div>
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </section>
    </>
  );
};

export default Home;
