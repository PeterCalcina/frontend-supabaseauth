import { useAuthFetcher } from "../client/fetcher";
import { API_ENDPOINTS_REPORT } from "../endpoints";
import {
  CurrentStockReport,
  ExpiringStockReport,
  MovementHistoryReport,
} from "@/shared/types/report";
import { PaginatedReportResponse } from "@/shared/types/paginate-report";
import {
  GetCurrentStockDto,
  GetMovementHistoryDto,
  GetExpiringStockDto,
} from "@/shared/schemas/report.schema";

export const reportService = () => {
  const fetcher = useAuthFetcher();

  return {
    getCurrentStock: async (params: GetCurrentStockDto) => {
      const { data } = await fetcher<
        PaginatedReportResponse<CurrentStockReport>
      >(API_ENDPOINTS_REPORT.getCurrentStock, {
        method: "GET",
        params: params,
      });
      return data;
    },

    getMovementHistory: async (params: GetMovementHistoryDto) => {
      const { data } = await fetcher<
        PaginatedReportResponse<MovementHistoryReport>
      >(API_ENDPOINTS_REPORT.getMovementHistory, {
        method: "GET",
        params: params,
      });
      return data;
    },

    getExpirations: async (params: GetExpiringStockDto) => {
      const { data } = await fetcher<
        PaginatedReportResponse<ExpiringStockReport>
      >(API_ENDPOINTS_REPORT.getExpirations, {
        method: "GET",
        params: params,
      });
      return data;
    },
  };
};
