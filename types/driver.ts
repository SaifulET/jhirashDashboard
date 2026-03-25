export interface DriverListItem {
  no: number;
  _id: string;
  driverName: string;
  email: string;
  contact: string;
  userStatus: string;
  driverStatus: string;
  deletionStatus: string;
  rating: number;
  reportsCount: number;
  createdAt: string;
}

export interface DriversPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DriversResponseData {
  items: DriverListItem[];
  pagination: DriversPagination;
}

export interface DriverDeletionInfo {
  isDeleted: boolean;
  deletedAt: string | null;
  timelineDays: number;
  daysLeft: number | null;
  status: string;
}

export interface DriverProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  emergency: string | null;
  profileImage: string | null;
  joiningDate: string;
  userStatus: string;
  driverStatus: string;
  rating: number;
  ratingCount: number;
  accusedCount: number;
  documentsStatus: string;
  requiredActionsCount: number;
  deletion: DriverDeletionInfo;
}

export interface DriverDetailResponseData {
  profile: DriverProfile;
}

export interface DriverDocument {
  key: string;
  title: string;
  status: string;
  rawStatus: string;
  itemCount: number;
}

export interface DriverDocumentsResponseData {
  documents: DriverDocument[];
}

export interface DriverDocumentFileItem {
  key: string;
  fileUrl: string;
  status: string;
  rejectionReason: string | null;
}

export interface DriverSingleDocumentFile {
  _id: string;
  fileUrl: string;
  rejectionReason: string | null;
  reviewedAt: string | null;
}

export interface DriverVehicleInformation {
  _id: string;
  isActive: boolean;
  driverId: string;
  approved: boolean;
  brand: string;
  createdAt: string;
  licensePlate: string;
  model: string;
  priceRange: number;
  seats: number;
  size: string;
  tier: string;
  type: string;
  updatedAt: string;
  year: number;
}

export interface DriverDocumentDetail {
  type: string;
  title: string;
  status: string;
  items?: DriverDocumentFileItem[];
  document?: DriverSingleDocumentFile;
  vehicle?: DriverVehicleInformation;
}

export interface DriverDocumentDetailResponseData {
  data: DriverDocumentDetail;
}

export interface ReviewDriverDocumentPayload {
  status: "verified" | "denied";
  rejectionReason?: string;
}

export interface ReviewedDriverDocument {
  _id: string;
  driverId: string;
  type: string;
  createdAt: string;
  fileUrl: string;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: string;
  status: string;
  updatedAt: string;
}

export interface ReviewedDriverProfileState {
  status: string;
  documentsStatus: string;
  requiredActionsCount: number;
}

export interface ReviewDriverDocumentResponseData {
  type: string;
  status: string;
  documents: ReviewedDriverDocument[];
  driverProfile: ReviewedDriverProfileState;
}

export interface DriverHistoryFare {
  currency: string;
  total: number;
  driverGets: number;
}

export interface DriverHistoryItem {
  _id: string;
  status: string;
  createdAt: string;
  fare: DriverHistoryFare;
  riderRating: number | null;
}

export interface DriverHistoryResponseData {
  items: DriverHistoryItem[];
}

export interface DriverReportItem {
  _id?: string;
  comment?: string;
  reason?: string;
  createdAt?: string;
  reporterName?: string;
  reporterRole?: string;
}

export interface DriverReportsResponseData {
  items: DriverReportItem[];
}
