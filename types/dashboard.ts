export interface DashboardFilters {
  month: number;
  year: number;
}

export interface DashboardMonthlyBreakdown {
  currency: string;
  regularVehiclesIncome: number;
  premiumVehiclesIncome: number;
  totalIncome: number;
}

export interface DashboardUserChartItem {
  month: number;
  label: string;
  rider: number;
  driver: number;
}

export interface DashboardUserOverview {
  year: number;
  chart: DashboardUserChartItem[];
  totals: {
    rider: number;
    driver: number;
  };
  overall: {
    rider: number;
    driver: number;
  };
}

export interface DashboardOverviewData {
  filters: DashboardFilters;
  monthlyBreakdown: DashboardMonthlyBreakdown;
  userOverview: DashboardUserOverview;
}

export interface DashboardAnalyticsRevenueChartItem {
  month: number;
  label: string;
  amount: number;
}

export interface DashboardAnalyticsRevenueMetrics {
  currency: string;
  chart: DashboardAnalyticsRevenueChartItem[];
  totalRevenue: number;
}

export interface DashboardAnalyticsUserMetrics {
  year: number;
  chart: DashboardUserChartItem[];
  totals: {
    rider: number;
    driver: number;
  };
  overall: {
    rider: number;
    driver: number;
  };
}

export interface DashboardAnalyticsData {
  filters: {
    year: number;
  };
  revenueMetrics: DashboardAnalyticsRevenueMetrics;
  userMetrics: DashboardAnalyticsUserMetrics;
}
