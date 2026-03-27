export type LegalContentType = "terms-and-conditions" | "privacy-policy";

export interface LegalContentDelta {
  ops: Array<{
    insert?: string | Record<string, unknown>;
    attributes?: Record<string, unknown>;
  }>;
}

export interface LegalContentItem {
  _id: string;
  type: LegalContentType;
  title: string;
  contentHtml: string;
  contentDelta: LegalContentDelta | null;
  plainText: string;
  isPublished: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalContentListResponseData {
  type: LegalContentType;
  items: LegalContentItem[];
}

export interface CreateLegalContentPayload {
  type: LegalContentType;
  title: string;
  contentHtml: string;
  contentDelta: LegalContentDelta | null;
  isPublished: boolean;
}

export interface UpdateLegalContentPayload {
  title: string;
  contentHtml: string;
  plainText: string;
  contentDelta: LegalContentDelta | null;
  isPublished: boolean;
}
