import { ArrowLeft01FreeIcons, Calendar01FreeIcons, Car01FreeIcons, Clock01FreeIcons, Clock01Icon, MapPinFreeIcons, MapPinIcon, StarAward01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';


interface TripDetailProps {
  driver: {
    name: string;
    rating: number;
    vehicle: string;
    avatar: string;
  };
  fare: number;
  rating: number;
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: string;
  duration: string;
  status: string;
  reviews: {
    reviewer: {
      name: string;
      role: string;
      avatar: string;
    };
    rating: number;
    comment: string;
  }[];
}

const TripDetail: React.FC<TripDetailProps> = ({
  driver,
  fare,
  rating,
  date,
  time,
  pickupLocation,
  dropoffLocation,
  distance,
  duration,
  status,
  reviews
}) => {
  return (
    <div className="min-h-screen bg-[#F4F4F6] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-full bg-[#A6AFFF] flex items-center justify-center hover:bg-[#9099FF] transition-colors">
              <HugeiconsIcon  icon={ArrowLeft01FreeIcons} size={24} color="#000" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Trip detail</h1>
              <p className="text-sm text-gray-500">This section will show trip detail</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-[#BC0E01] text-white rounded-lg hover:bg-[#A00C01] transition-colors font-medium">
            Delete
          </button>
        </div>

        {/* Driver Info */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={driver.avatar} 
                alt={driver.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{driver.name}</h2>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={StarAward01FreeIcons} size={16} color="#FFA500"/>
                    <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{driver.vehicle}</p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
              {status}
            </span>
          </div>

          {/* Fare and Rating */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-gray-900">${fare.toFixed(2)}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">FARE</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <HugeiconsIcon icon={StarAward01FreeIcons}  size={20} color="#FFA500"  />
                <span className="text-2xl font-semibold text-gray-900">{rating}</span>
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">RATING</div>
            </div>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={Calendar01FreeIcons}  size={20} color="#6366F1" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-base font-medium text-gray-900">{date}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={MapPinFreeIcons} size={20} color="#6366F1" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup location</p>
                  <p className="text-base font-medium text-gray-900">{pickupLocation}</p>
                </div>
              </div>

              {/* Distance Covered */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={Car01FreeIcons} size={20} color="#6366F1" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Distance covered</p>
                  <p className="text-base font-medium text-gray-900">{distance}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={Clock01FreeIcons} size={20} color="#9333EA" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-base font-medium text-gray-900">{time}</p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={MapPinIcon} size={20} color="#9333EA" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dropoff location</p>
                  <p className="text-base font-medium text-gray-900">{dropoffLocation}</p>
                </div>
              </div>

              {/* Total Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                   <HugeiconsIcon icon={Clock01Icon} size={20} color="#9333EA" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total time</p>
                  <p className="text-base font-medium text-gray-900">{duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={review.reviewer.avatar} 
                  alt={review.reviewer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{review.reviewer.name}</h3>
                  <p className="text-sm text-gray-500">{review.reviewer.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={StarAward01FreeIcons} size={16} color="#FFA500" />
                <span className="text-sm font-medium text-gray-900">{review.rating}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage with sample data
export default function TripDetailPage() {
  const tripData: TripDetailProps = {
    driver: {
      name: 'David John',
      rating: 4.7,
      vehicle: 'Toyota Sienna LE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    fare: 25.00,
    rating: 4.5,
    date: 'Mon, Jan 19, 2026',
    time: '10:00 AM',
    pickupLocation: 'Brac University Building 5',
    dropoffLocation: 'Gulshan 1 DNCC Market',
    distance: '1.3 mi',
    duration: '24 min',
    status: 'Completed',
    reviews: [
      {
        reviewer: {
          name: 'Tuval Mor',
          role: 'Rider',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        },
        rating: 4.5,
        comment: 'Great driver! Friendly, respectful, and easy to communicate with. Would be happy to have them again.'
      },
      {
        reviewer: {
          name: 'David John',
          role: 'Driver',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        rating: 4.2,
        comment: 'Great driver! Friendly, respectful, and easy to communicate with. Would be happy to have them again.'
      }
    ]
  };

  return <TripDetail {...tripData} />;
}