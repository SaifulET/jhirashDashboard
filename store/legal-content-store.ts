import { create } from "zustand";
import {
  createLegalContentRequest,
  deleteLegalContentRequest,
  getLegalContentDetailRequest,
  getLegalContentsRequest,
  updateLegalContentRequest,
} from "@/api/legal-content";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  CreateLegalContentPayload,
  LegalContentItem,
  LegalContentType,
  UpdateLegalContentPayload,
} from "@/types/legal-content";

interface LegalContentStore {
  itemsByType: Partial<Record<LegalContentType, LegalContentItem[]>>;
  selectedItem: LegalContentItem | null;
  isListLoading: boolean;
  isDetailLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  listErrorMessage: string;
  detailErrorMessage: string;
  saveErrorMessage: string;
  deleteErrorMessage: string;
  fetchLegalContents: (type: LegalContentType) => Promise<void>;
  fetchLegalContentDetail: (
    type: LegalContentType,
    contentId: string
  ) => Promise<void>;
  createLegalContent: (
    type: LegalContentType,
    payload: CreateLegalContentPayload
  ) => Promise<LegalContentItem>;
  updateLegalContent: (
    type: LegalContentType,
    contentId: string,
    payload: UpdateLegalContentPayload
  ) => Promise<LegalContentItem>;
  deleteLegalContent: (
    type: LegalContentType,
    contentId: string
  ) => Promise<string>;
  clearSelectedItem: () => void;
  clearMessages: () => void;
}

export const useLegalContentStore = create<LegalContentStore>((set) => ({
  itemsByType: {},
  selectedItem: null,
  isListLoading: false,
  isDetailLoading: false,
  isSaving: false,
  isDeleting: false,
  listErrorMessage: "",
  detailErrorMessage: "",
  saveErrorMessage: "",
  deleteErrorMessage: "",

  fetchLegalContents: async (type) => {
    set({
      isListLoading: true,
      listErrorMessage: "",
    });

    try {
      const response = await getLegalContentsRequest(type);

      set((state) => ({
        itemsByType: {
          ...state.itemsByType,
          [type]: response.data.items,
        },
        isListLoading: false,
      }));
    } catch (error) {
      set({
        isListLoading: false,
        listErrorMessage: getApiErrorMessage(
          error,
          "Unable to load legal contents right now."
        ),
      });
    }
  },

  fetchLegalContentDetail: async (type, contentId) => {
    set({
      isDetailLoading: true,
      detailErrorMessage: "",
      selectedItem: null,
    });

    try {
      const response = await getLegalContentDetailRequest(type, contentId);

      set({
        selectedItem: response.data,
        isDetailLoading: false,
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        detailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this legal content right now."
        ),
      });
    }
  },

  createLegalContent: async (type, payload) => {
    set({
      isSaving: true,
      saveErrorMessage: "",
    });

    try {
      const response = await createLegalContentRequest(type, payload);

      set((state) => ({
        isSaving: false,
        itemsByType: {
          ...state.itemsByType,
          [type]: [response.data, ...(state.itemsByType[type] || [])],
        },
      }));

      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to create this legal content right now."
      );

      set({
        isSaving: false,
        saveErrorMessage: message,
      });

      throw new Error(message);
    }
  },

  updateLegalContent: async (type, contentId, payload) => {
    set({
      isSaving: true,
      saveErrorMessage: "",
    });

    try {
      const response = await updateLegalContentRequest(type, contentId, payload);

      set((state) => ({
        isSaving: false,
        selectedItem: response.data,
        itemsByType: {
          ...state.itemsByType,
          [type]: (state.itemsByType[type] || []).map((item) =>
            item._id === contentId ? response.data : item
          ),
        },
      }));

      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to update this legal content right now."
      );

      set({
        isSaving: false,
        saveErrorMessage: message,
      });

      throw new Error(message);
    }
  },

  deleteLegalContent: async (type, contentId) => {
    set({
      isDeleting: true,
      deleteErrorMessage: "",
    });

    try {
      const response = await deleteLegalContentRequest(type, contentId);

      set((state) => ({
        isDeleting: false,
        selectedItem:
          state.selectedItem?._id === contentId ? null : state.selectedItem,
        itemsByType: {
          ...state.itemsByType,
          [type]: (state.itemsByType[type] || []).filter(
            (item) => item._id !== contentId
          ),
        },
      }));

      return response.message;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to delete this legal content right now."
      );

      set({
        isDeleting: false,
        deleteErrorMessage: message,
      });

      throw new Error(message);
    }
  },

  clearSelectedItem: () => {
    set({
      selectedItem: null,
      detailErrorMessage: "",
      isDetailLoading: false,
    });
  },

  clearMessages: () => {
    set({
      listErrorMessage: "",
      detailErrorMessage: "",
      saveErrorMessage: "",
      deleteErrorMessage: "",
    });
  },
}));
