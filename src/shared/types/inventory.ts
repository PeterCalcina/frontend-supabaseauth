export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  cost: number;
  lastEntry?: Date;
  createdAt: string;
  updatedAt: string;
}