'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface VehicleInfoViewProps {
  onBack: () => void;
}

const VehicleInfoView: React.FC<VehicleInfoViewProps> = ({ onBack }) => {
  const vehicleData = {
    brand: 'BMW',
    model: 'M3',
    year: '2024',
    type: 'SUV',
    seats: '8',
    licensePlate: '985 659 5959'
  };

  return (
    <div className="bg-white rounded-lg ">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detail of Vehicle Information
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

        {/* Vehicle Information Grid */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-2 gap-x-16">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Brand
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.brand}</div>
              <hr />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Model
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.model}</div>
              <hr />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Year
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.year}</div>
              <hr />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Type
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.type}</div>
              <hr />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Seats
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.seats}</div>
              <hr />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                License Plate
              </label>
              <div className="text-gray-900 mb-3">{vehicleData.licensePlate}</div>
              <hr />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-8 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors">
            Decline
          </button>
          <button className="px-8 py-2.5 bg-[#10B981] hover:bg-[#0ea572] text-white font-medium rounded-lg transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoView;