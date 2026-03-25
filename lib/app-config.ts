import type { BaseFareKey } from "@/types/app-config";

export const APP_CONFIG_FIELDS: Array<{
  title: string;
  fields: Array<{
    key: BaseFareKey;
    label: string;
  }>;
}> = [
  {
    title: "Car",
    fields: [
      { key: "car_regular", label: "Regular" },
      { key: "car_premium", label: "Premium" },
    ],
  },
  {
    title: "SUV",
    fields: [
      { key: "suv_compact_regular", label: "Regular (Compact)" },
      { key: "suv_full_regular", label: "Regular (Full)" },
      { key: "suv_compact_premium", label: "Premium (Compact)" },
      { key: "suv_full_premium", label: "Premium (Full)" },
    ],
  },
  {
    title: "Van",
    fields: [
      { key: "van_compact_regular", label: "Regular (Compact)" },
      { key: "van_full_regular", label: "Regular (Full)" },
      { key: "van_compact_premium", label: "Premium (Compact)" },
      { key: "van_full_premium", label: "Premium (Full)" },
    ],
  },
];

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "EUR";
    case "GBP":
      return "GBP";
    default:
      return currency || "$";
  }
};

export const formatCurrencyAmount = (value: number) => value.toFixed(2);
