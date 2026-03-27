import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateLegalContentPayload,
  LegalContentItem,
  LegalContentListResponseData,
  LegalContentType,
  UpdateLegalContentPayload,
} from "@/types/legal-content";

export const getLegalContentsRequest = async (type: LegalContentType) => {
  const response = await apiClient.get<ApiResponse<LegalContentListResponseData>>(
    `/admin/legal-content/${type}`
  );

  return response.data;
};

export const getLegalContentDetailRequest = async (
  type: LegalContentType,
  contentId: string
) => {
  const response = await apiClient.get<ApiResponse<LegalContentItem>>(
    `/admin/legal-content/${type}/${contentId}`
  );

  return response.data;
};

export const createLegalContentRequest = async (
  type: LegalContentType,
  payload: CreateLegalContentPayload
) => {
  const response = await apiClient.post<ApiResponse<LegalContentItem>>(
    `/admin/legal-content/${type}`,
    payload
  );

  return response.data;
};

export const updateLegalContentRequest = async (
  type: LegalContentType,
  contentId: string,
  payload: UpdateLegalContentPayload
) => {
  const response = await apiClient.patch<ApiResponse<LegalContentItem>>(
    `/admin/legal-content/${type}/${contentId}`,
    payload
  );

  return response.data;
};

export const deleteLegalContentRequest = async (
  type: LegalContentType,
  contentId: string
) => {
  const response = await apiClient.delete<ApiResponse<{ message?: string }>>(
    `/admin/legal-content/${type}/${contentId}`
  );

  return response.data;
};
