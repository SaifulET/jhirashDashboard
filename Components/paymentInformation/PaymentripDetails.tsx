'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  Car02Icon,
  Clock01Icon,
  Money04Icon,
  Vynil01Icon,
} from '@hugeicons/core-free-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { usePaymentStore } from '@/store/payment-store';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

const formatCurrency = (currency: string, value: number) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const toLabelCase = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

export default function PaymentTripDetail() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const tripId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const riderId = searchParams.get('riderId');
  const selectedTripDetail = usePaymentStore((state) => state.selectedTripDetail);
  const isDetailLoading = usePaymentStore((state) => state.isDetailLoading);
  const detailErrorMessage = usePaymentStore((state) => state.detailErrorMessage);
  const fetchTripDetail = usePaymentStore((state) => state.fetchTripDetail);

  useEffect(() => {
    if (riderId && tripId) {
      void fetchTripDetail(riderId, tripId);
    }
  }, [fetchTripDetail, riderId, tripId]);

  if (!riderId || !tripId) {
    return (
      <div className="min-h-screen bg-[#F4F4F6] p-6">
        <div className="mx-[174px] my-[40px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Missing trip information. Please open this page from the payment list.
        </div>
      </div>
    );
  }

  const trip = selectedTripDetail?.trip;

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-6">
      <div className="mx-[174px] my-[40px]">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pages/payment-information">
            <button className="w-10 h-10 rounded-lg bg-[#A6AFFF] flex items-center justify-center hover:bg-[#9299ee] transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip detail</h1>
            <p className="text-sm text-gray-500">
              This section will show trip detail
            </p>
          </div>
        </div>

        {isDetailLoading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-sm text-gray-500">
            Loading trip details...
          </div>
        )}

        {!isDetailLoading && detailErrorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {detailErrorMessage}
          </div>
        )}

        {!isDetailLoading && trip && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Image
                  src={trip.driver.profileImage || '/profile.svg'}
                  alt={trip.driver.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {trip.driver.name}
                    </h2>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {trip.driver.ratingAvg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {trip.vehicle.brand} {trip.vehicle.model}
                  </p>
                </div>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  trip.status.toLowerCase() === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {toLabelCase(trip.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <HugeiconsIcon icon={Money04Icon} className="text-[#047049]" />
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(trip.fare.currency, trip.fare.total)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">FARE</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {trip.driverReview?.rating ?? 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">RATING</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 rounded-xl bg-[#F4F4F6] p-5">
              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Calendar03Icon} className="text-[#6662FF]" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(trip.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Clock01Icon} className="text-[#6662FF]" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">
                    {formatTime(trip.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Vynil01Icon} className="text-[#6662FF]" />
                <div>
                  <p className="text-sm text-gray-500">Pickup location</p>
                  <p className="font-medium text-gray-900">
                    {trip.pickup.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6662FF] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff location</p>
                  <p className="font-medium text-gray-900">
                    {trip.dropoff.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Car02Icon} className="text-[#6662FF]" />
                <div>
                  <p className="text-sm text-gray-500">Distance covered</p>
                  <p className="font-medium text-gray-900">
                    {trip.distanceMiles.toFixed(1)} mi
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-[#6662FF]" />
                <div>
                  <p className="text-sm text-gray-500">Total time</p>
                  <p className="font-medium text-gray-900">
                    {Math.round(trip.durationMinutes)} min
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3 px-[16px] py-[12px] bg-[#F4F4F6] rounded-lg">
                <Image
                  src="/profile.svg"
                  alt="Rider review"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">Rider</h3>
                      <p className="text-xs text-gray-500">Rider</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {trip.riderReview?.rating ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {trip.riderReview?.comment || 'No rider review available.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 px-[16px] py-[12px] bg-[#F4F4F6] rounded-lg">
                <Image
                  src={trip.driver.profileImage || '/profile.svg'}
                  alt={trip.driver.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {trip.driver.name}
                      </h3>
                      <p className="text-xs text-gray-500">Driver</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {trip.driverReview?.rating ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {trip.driverReview?.comment || 'No driver review available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
