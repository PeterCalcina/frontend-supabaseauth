import { Status } from "../enum/status.enum";
import { MovementType } from "../enum/movement-type.enum";

export interface Movement {
  id: string;
  batchCode: string;
  type: MovementType;
  quantity: number;
  unitCost: number;
  remainingQuantity: number;
  expirationDate: Date;
  description: string;
  itemId: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

