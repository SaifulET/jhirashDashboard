import React from 'react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[565px] py-[388px] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[471px] h-[288px] flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Add Terms & Conditions
        </h1>
        
        <p className="text-center text-sm text-gray-600 mb-6 px-4">
          Please enter your Terms and Conditions. These will be displayed
          to users and drivers during the registration process. Make sure
          your terms comply with legal requirements.
        </p>
        
        <button className="bg-[#240183] text-[#FFD283] px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-[#1a0161] transition-colors">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M8 3.33334V12.6667M3.33333 8H12.6667" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}