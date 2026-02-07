
"use client"; // If using App Router

import React from "react";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ArrowLeft01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


const WelcomePage: NextPage = () => {

  const router = useRouter();



  const handleBackToLogin = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] relative">
      {/* Main content - Positioned to avoid overlap with patterns */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center "
        style={{ paddingTop: "139px",}}
      >
        <div className="w-[564px]  bg-white  p-8 flex flex-col items-center gap-6  rounded-xl shadow-lg">
          {/* Logo */}
          <div className="w-full max-w-[500px]  flex items-center justify-center">
            <div className="text-center bg-[#D7FFEA] p-[14px] rounded-full border-2 border-[#047049]">
              
              <HugeiconsIcon icon={Tick01Icon} className="text-[#047049]"  size={24}/>
            </div>
          </div>

          {/* Title and subtitle section */}
          <div className=" flex flex-col items-center gap-1">
            <h2 className="  text-3xl font-semibold text-gray-800 text-center">
              Successfully Changed
            </h2>
            <p className="  text-base text-gray-500 leading-6 text-center">
              Return to the login page to enter your account with your new password
            </p>
          </div>

          {/* Form section */}
          <div className=" flex ">
 

            {/* Next button */}
            <button
              onClick={handleBackToLogin }
             
              className="w-full   text-[#240183] font-medium text-base py-4 px-32 rounded-xl h-[55px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#240183] focus:ring-offset-2 flex items-center justify-center"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} />Back to Login
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
