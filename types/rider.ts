export interface RidersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RiderListItem {
  no: number;
  _id: string;
  riderName: string;
  email: string;
  contact: string;
  userStatus: string;
  deletionStatus: string;
  rating: number;
  reportsCount: number;
  createdAt: string;
}

export interface RidersResponseData {
  items: RiderListItem[];
  pagination: RidersPagination;
}

export interface RiderDeletionInfo {
  isDeleted: boolean;
  deletedAt: string | null;
  timelineDays: number;
  daysLeft: number | null;
  status: string;
}

export interface RiderProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  emergency: string | null;
  profileImage: string | null;
  joiningDate: string;
  userStatus: string;
  rating: number;
  ratingCount: number;
  accusedCount: number;
  tripsCount: number;
  savedPlacesCount: number;
  deletion: RiderDeletionInfo;
}

export interface RiderDetailResponseData {
  profile: RiderProfile;
}

export interface RiderHistoryFare {
  currency: string;
  estimatedFare: number;
  finalFare: number;
  total: number;
}

export interface RiderHistoryDriver {
  _id: string;
  name: string;
  profileImage: string | null;
  ratingAvg: number;
  ratingCount: number;
}

export interface RiderHistoryVehicle {
  _id: string;
  brand: string;
  model: string;
  type: string;
  size: string;
  licensePlate: string;
}

export interface RiderTripReview {
  rating?: number | null;
  comment?: string | null;
}

export interface RiderHistoryItem {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fare: RiderHistoryFare;
  driver: RiderHistoryDriver;
  vehicle: RiderHistoryVehicle;
  driverReview: RiderTripReview | null;
  riderReview: RiderTripReview | null;
}

export interface RiderHistoryResponseData {
  items: RiderHistoryItem[];
}

export interface RiderReportItem {
  _id?: string;
  comment?: string;
  reason?: string;
  createdAt?: string;
  reporterName?: string;
  reporterRole?: string;
}

export interface RiderReportsResponseData {
  items: RiderReportItem[];
}
