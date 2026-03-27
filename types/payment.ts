export interface RiderPaymentParty {
  _id: string;
  name: string;
  profileImage: string | null;
  ratingAvg: number;
  ratingCount: number;
}

export interface RiderPaymentItem {
  no: number;
  _id: string;
  tripId: string | null;
  paymentId: string;
  rider: RiderPaymentParty | null;
  riderName: string | null;
  driver: RiderPaymentParty | null;
  driverName: string | null;
  tripStatus: string | null;
  paymentStatus: string;
  tripPaymentStatus: string | null;
  totalFare: number;
  driverGets: number;
  platformGets: number;
  received: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
}

export interface RiderPaymentsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RiderPaymentsResponseData {
  items: RiderPaymentItem[];
  pagination: RiderPaymentsPagination;
}

export interface PaymentTripPoint {
  type: string;
  coordinates: number[];
}

export interface PaymentTripLocation {
  address: string;
  point: PaymentTripPoint;
}

export interface PaymentTripFare {
  currency: string;
  estimatedFare: number;
  finalFare: number;
  total: number;
}

export interface PaymentTripVehicle {
  _id: string;
  brand: string;
  model: string;
  type: string;
  size: string;
  licensePlate: string;
}

export interface PaymentTripReview {
  rating?: number | null;
  comment?: string | null;
}

export interface RiderPaymentTrip {
  _id: string;
  requestId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fare: PaymentTripFare;
  pickup: PaymentTripLocation;
  dropoff: PaymentTripLocation;
  distanceMiles: number;
  durationMinutes: number;
  cancellation: {
    feeCharged: number;
  };
  paymentStatus: string;
  driver: RiderPaymentParty;
  vehicle: PaymentTripVehicle;
  driverReview: PaymentTripReview | null;
  riderReview: PaymentTripReview | null;
}

export interface RiderPaymentDetail {
  _id: string;
  provider: string;
  status: string;
  currency: string;
  totalFare: number;
  driverGets: number;
  platformGets: number;
  received: number;
  paidAt: string | null;
  failureMessage: string | null;
  stripeCustomerId: string | null;
  stripePaymentIntentId: string | null;
  stripePaymentMethodId: string | null;
  breakdown: {
    cancellationFee: number;
    platformFee: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RiderPaymentTripDetailResponseData {
  trip: RiderPaymentTrip;
  payment: RiderPaymentDetail;
}
