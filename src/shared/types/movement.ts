export enum MovementType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
  EXPIRATION = "EXPIRATION",
  SALE = "SALE",
}

export interface Movement {
  id: string;
  type: MovementType;
  quantity: string;
  unitCost: string;
  data: string;
  itemId: string;
  createdAt: string;
  updatedAt: string;
}

