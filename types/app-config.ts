export interface BaseFare {
  car_regular: number;
  car_premium: number;
  suv_compact_regular: number;
  suv_compact_premium: number;
  suv_full_regular: number;
  suv_full_premium: number;
  van_compact_regular: number;
  van_compact_premium: number;
  van_full_regular: number;
  van_full_premium: number;
}

export type BaseFareKey = keyof BaseFare;

export interface AppConfig {
  _id: string;
  name: string;
  active: boolean;
  currency: string;
  baseFare: BaseFare;
  pricePerMile: number;
  pricePerMinute: number;
  driverSharePercent: number;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAppConfigPayload {
  baseFare?: Partial<BaseFare>;
  pricePerMinute?: number;
  driverSharePercent?: number;
}
