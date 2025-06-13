import { reportService } from "@/api/services/report.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetCurrentStockDto, GetMovementHistoryDto, GetExpiringStockDto } from "@/shared/schemas/report.schema";

export const useCurrentStockReport = (params: GetCurrentStockDto) => {
  const { getCurrentStock } = reportService();

  return useQuery({
    queryKey: ['report', 'current-stock', params],
    queryFn: () => getCurrentStock(params),
    placeholderData: keepPreviousData
  });
}; 

export const useMovementHistoryReport = (params: GetMovementHistoryDto) => {
  const { getMovementHistory } = reportService();

  return useQuery({
    queryKey: ['report', 'movement-history', params],
    queryFn: () => getMovementHistory(params),
    placeholderData: keepPreviousData
  });
};

export const useExpiringStockReport = (params: GetExpiringStockDto) => { 
  const { getExpirations } = reportService();
  return useQuery({
    queryKey: ['report', 'expiring-stock', params],
    queryFn: () => getExpirations(params),
    placeholderData: keepPreviousData
  });
};