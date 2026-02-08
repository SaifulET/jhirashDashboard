'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Eye } from 'lucide-react';

interface VehicleInsuranceViewProps {
  onBack: () => void;
}

const VehicleInsuranceView: React.FC<VehicleInsuranceViewProps> = ({ onBack }) => {
  const [showFullView, setShowFullView] = React.useState(false);

  return (
    <div className="bg-white rounded-lg ">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detail of Vehicle Insurance Information
              </h2>
              <p className="text-sm text-gray-500">
                This section will show every detail of a particular user.
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-[#BC0E01] hover:bg-[#a00c01] text-white rounded-lg font-medium transition-colors">
            Delete
          </button>
        </div>

        {/* Insurance Document Image */}
        <div className="mb-6">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src="/driver.svg"
              alt="Vehicle Insurance Document"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-8 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors">
            Decline
          </button>
          <button
            onClick={() => setShowFullView(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#A6AFFF] hover:bg-[#97a0f5] text-gray-900 font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Full View
          </button>
          <button className="px-8 py-2.5 bg-[#10B981] hover:bg-[#0ea572] text-white font-medium rounded-lg transition-colors">
            Accept
          </button>
        </div>
      </div>

      {/* Full View Modal */}
      {showFullView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <Image
                src="/driver.svg"
                alt="Full View"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setShowFullView(false)}
              className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInsuranceView;