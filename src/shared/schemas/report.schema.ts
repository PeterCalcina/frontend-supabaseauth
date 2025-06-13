import { MovementType } from "../enum/movement-type.enum";

export interface GetCurrentStockDto {
  itemId?: number;
  itemName?: string;
  minQty?: number;
  maxQty?: number;
  page?: number;
  pageSize?: number;
}

export interface GetMovementHistoryDto {
  startDate: Date;
  endDate: Date;
  itemId?: number;
  movementType?: MovementType;
  batchCode?: string;
  page?: number;
  pageSize?: number;
}

export interface GetExpiringStockDto {
  status?: 'expired' | 'expiring-soon' | 'all';
  daysUntilExpiration?: number;
  itemId?: number;
  page?: number;
  pageSize?: number;
}

