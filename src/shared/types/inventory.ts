import { Status } from "../enum/status.enum";

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  qty: number;
  cost: number;
  profitMargin: number;
  lastEntry?: Date;
  status: Status;
  createdAt: string;
  updatedAt: string;
}