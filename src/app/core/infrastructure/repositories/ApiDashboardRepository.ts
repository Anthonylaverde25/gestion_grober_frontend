import { axiosInstance } from "../../../di/container";

export interface DashboardOverview {
  active_production: Array<{
    id: string;
    name: string;
    status: string;
    current_article_name: string;
    current_client_name: string;
    current_campaign_id: string;
    latest_yield: {
      percentage: number;
      recorded_at: string;
    } | null;
  }>;
  yield_series: Array<{
    machine_id: string;
    machine_name: string;
    data: Array<{
      value: number;
      time: string;
      timestamp: string;
    }>;
  }>;
  summary: {
    total_active_lines: number;
    average_yield: number;
  };
}

export class ApiDashboardRepository {
  async getOverview(companyId?: string): Promise<DashboardOverview> {
    const params = companyId ? { company_id: companyId } : {};
    const response = await axiosInstance.get('/api/v1/dashboard/overview', { params });
    return response.data.data;
  }

  async getLinesPerformanceSummary(companyId?: string): Promise<{ avg_forming: number; avg_packing: number }> {
    const params = companyId ? { company_id: companyId } : {};
    const response = await axiosInstance.get('/api/v1/dashboard/lines-performance/summary', { params });
    return response.data.data;
  }
}
