export interface CustomerSupportParty {
  _id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  ratingAvg: number;
  ratingCount: number;
  accusedCount: number;
  status: string;
}

export interface CustomerSupportTrip {
  _id?: string;
  [key: string]: unknown;
}

export interface CustomerSupportAdminAction {
  [key: string]: unknown;
}

export interface CustomerSupportItem {
  no: number;
  _id: string;
  entryType: string;
  reportingParty: CustomerSupportParty | null;
  reportingPartyName: string | null;
  userType: string | null;
  email: string | null;
  contact: string | null;
  status: string;
  complaint: string;
  title: string;
  message: string;
  tripId: string | null;
  againstUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSupportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerSupportListResponseData {
  items: CustomerSupportItem[];
  pagination: CustomerSupportPagination;
}

export interface CustomerSupportDetailItem {
  _id: string;
  entryType: string;
  status: string;
  complaint: boolean;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  trip: CustomerSupportTrip | null;
  reportingParty: CustomerSupportParty | null;
  reportedParty: CustomerSupportParty | null;
  adminAction: CustomerSupportAdminAction | null;
}

export interface CustomerSupportDetailResponseData {
  item: CustomerSupportDetailItem;
}
