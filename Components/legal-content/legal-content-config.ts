import type { LegalContentType } from "@/types/legal-content";

export interface LegalContentConfig {
  type: LegalContentType;
  pageTitle: string;
  pageDescription: string;
  addCardTitle: string;
  addCardDescription: string;
  editorHeading: string;
  editorDescription: string;
  editorLabel: string;
  editorPlaceholder: string;
  basePath: string;
  defaultTitle: string;
}

export const legalContentConfigs: Record<LegalContentType, LegalContentConfig> = {
  "terms-and-conditions": {
    type: "terms-and-conditions",
    pageTitle: "Terms & Conditions",
    pageDescription: "Manage terms & conditions for the MA3 platform.",
    addCardTitle: "Add Terms & Conditions",
    addCardDescription:
      "Please enter your Terms and Conditions. These will be displayed to users and drivers during the registration process. Make sure your terms comply with legal requirements.",
    editorHeading: "Terms & Conditions",
    editorDescription: "Set terms & conditions for the M&S platform.",
    editorLabel: "Write Terms & Conditions",
    editorPlaceholder: "Write your terms and conditions here...",
    basePath: "/pages/terms-conditions",
    defaultTitle: "Terms & Conditions",
  },
  "privacy-policy": {
    type: "privacy-policy",
    pageTitle: "Privacy & Policy",
    pageDescription: "Manage privacy & policy for the MA3 platform.",
    addCardTitle: "Add Privacy & Policy",
    addCardDescription:
      "Please enter your Privacy Policy. This will be shown to users and drivers to inform them how their personal data will be collected, used, and protected. Ensure compliance with relevant data protection laws.",
    editorHeading: "Privacy & Policy",
    editorDescription: "Set privacy & policy for the M&S platform.",
    editorLabel: "Write Privacy & Policy",
    editorPlaceholder: "Write your privacy policy here...",
    basePath: "/pages/privacy-policy",
    defaultTitle: "Privacy Policy",
  },
};
