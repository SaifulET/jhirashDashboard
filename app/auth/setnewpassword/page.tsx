"use client"; // If using App Router

import React from "react";
import {  ArrowLeft } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import logo from "@/public/VerifyOTPsucsess.svg";
import Link from "next/link";

const SetNewPasswordPage: NextPage = () => {
  



  

  return (
    <div className="min-h-screen bg-[#F4F4F6] relative">
      {/* Main content - Positioned to avoid overlap with patterns */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center"
        style={{ paddingTop: "139px", paddingBottom: "139px" }}
      >
        <div className="w-[564px] bg-white p-[32px] flex flex-col items-center gap-6 rounded-xl shadow-lg">
          {/* Logo */}
          <div className="w-full flex items-center justify-center mb-2">
            <div className="text-center">
              <Image 
                src={logo} 
                alt="logo" 
                width={235} 
                height={201}
                className="max-w-full h-auto"
              />
            </div>
          </div>

          {/* Title and subtitle section */}
          <div className="w-full max-w-[277px] flex flex-col items-center gap-1">
            <h2 className="w-full text-3xl font-semibold text-gray-800 leading-9 text-center">
              Set Password
            </h2>
            <p className="w-full text-base text-gray-500 leading-6 text-center">
              Please set a new password. To set a new password press on continue...
            </p>
          </div>

          {/* Form section */}
          <div className="w-full max-w-[500px] flex flex-col gap-6">
            {/* Next button */}
           <Link href="/auth/new-password">
           <button
              
              className="w-full bg-[#240183] hover:bg-[#311483] text-[#FFD283] font-medium text-base py-4 px-8 rounded-xl h-[55px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              
                Next
             
            </button>
           </Link> 

            {/* Back to Login button */}
           <Link href="/auth/signin">
           
           <button
            
              className="w-full flex items-center justify-center gap-2 text-[#240183] font-medium text-base py-3.5 px-6 rounded-xl h-[52px] transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              Back to Login
            </button>
           
           </Link> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;