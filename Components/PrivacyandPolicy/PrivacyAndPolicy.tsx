import Link from 'next/link';
import React from 'react';

export default function PrivacyAndPolicy() {
  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[565px] py-[388px] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[471px] h-[288px] flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Add Privacy & Policy
        </h1>
        
        <p className="text-center text-sm text-gray-600 mb-6 px-4">
         Please enter your Privacy Policy. This will be shown to users and drivers to inform them how their personal data will be collected, used, and protected. Ensure compliance with relevant data protection laws.
        </p>
        
        <Link href="/pages/privacy-policy/add"><button  className="bg-[#240183] text-[#FFD283] px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-[#1a0161] transition-colors">
          
          +Add
        </button></Link>
      </div>
    </div>
  );
}