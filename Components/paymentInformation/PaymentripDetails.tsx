'use client';
import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Navigation,
  Star,
  Trash
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, Car02Icon, Clock01Icon, Money04Icon, Vynil01Icon } from '@hugeicons/core-free-icons';
import Image from 'next/image';

export default function RiderTripDetail() {
  return (
    <div className="min-h-screen bg-[#F4F4F6] p-6">
      <div className="mx-[174px] my-[40px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-lg bg-[#A6AFFF] flex items-center justify-center hover:bg-[#9299ee] transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail of Rider Trip</h1>
              <p className="text-sm text-gray-500">This section will show every detail of a particular user.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Delete
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* User Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/profile.svg" 
                alt="David John"
                className="w-14 h-14 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">David John</h2>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">4.7</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Toyota Sienna LE</p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Completed
            </span>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Fare */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-lg"><HugeiconsIcon icon={Money04Icon} className='text-[#047049]' /></span>
                </div>
                <span className="text-2xl font-bold text-gray-900">$25.00</span>
              </div>
              <p className="text-sm text-gray-500">FARE</p>
            </div>

            {/* Rating */}
            <div className="bg-gray-50 rounded-xl p-4 text-center"  >
              <div className="flex items-center gap-2 mb-2 justify-center">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">4.5</span>
              </div>
              <p className="text-sm text-gray-500">RATING</p>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={Calendar03Icon} className='text-[#6662FF]'/>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">Mon, Jan 19, 2026</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={Clock01Icon} className='text-[#6662FF]'/>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">10:00 AM</p>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={Vynil01Icon} className='text-[#6662FF]'/>
              <div>
                <p className="text-sm text-gray-500">Pickup location</p>
                <p className="font-medium text-gray-900">Brac University Building 5</p>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#6662FF] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Dropoff location</p>
                <p className="font-medium text-gray-900">Gulshan 1 DNCC Market</p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={Car02Icon} className='text-[#6662FF]'/>
              <div>
                <p className="text-sm text-gray-500">Distance covered</p>
                <p className="font-medium text-gray-900">1.3 mi</p>
              </div>
            </div>

            {/* Total Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5  mt-0.5 text-[#6662FF]" />
              <div>
                <p className="text-sm text-gray-500">Total time</p>
                <p className="font-medium text-gray-900">24 min</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-4 pt-4  mb-[20px]">
            {/* Rider Review */}
            <div className="flex gap-3 px-[16px] py-[12px] bg-[#F4F4F6]">
            
              <img src="/profile.svg" alt="Rider Profile" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">Tevel Mor</h3>
                    <p className="text-xs text-gray-500">Rider</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">4.5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Great driver! Friendly, respectful, and easy to communicate with. Would be happy to have them again.
                </p>
              </div>
            </div>

            {/* Driver Review */}
            <div className="flex gap-3 px-[16px] py-[12px] bg-[#F4F4F6]">
              
              <Image src="/profile.svg" alt="Profile" width={40} height={40} className="rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">David John</h3>
                    <p className="text-xs text-gray-500">Driver</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">4.2</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Great driver! Friendly, respectful, and easy to communicate with. Would be happy to have them again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}