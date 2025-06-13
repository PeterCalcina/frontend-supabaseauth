import { MovementType } from "../enum/movement-type.enum";

export interface CurrentStockReport {
  id: number;
  name: string;
  qty: number;
  cost: number;
  currentTotalValue: number; // Calculated field
  unitCost: number;
  totalQuantity: number;
}

export interface MovementHistoryReport {
  id: number;
  type: MovementType;
  quantity: number;
  unitCost: number;
  date: Date;
  batchCode: string;
  description: string;
  expirationDate?: Date;
  productName?: string;
}

export interface ExpiringStockReport {
  id: number;
  batchCode: string;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  expirationDate: Date;
  date: Date;
  productName?: string;
  productId?: number;
  isExpired: boolean;
}