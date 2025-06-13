import * as z from "zod";
import { MovementType } from "@/shared/enum/movement-type.enum";

export const BaseMovementSchema = z.object({
  type: z.nativeEnum(MovementType),
  batchCode: z.string().min(1, "El código de lote es requerido"),
  quantity: z.number().min(1, "La cantidad es requerida"),
  unitCost: z.number().min(0, "El costo unitario es requerido"),
  expirationDate: z.date().optional(),
  itemId: z.number().min(1, "El producto es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
});

export const entryMovementSchema = z.object(BaseMovementSchema.shape);
export type EntryMovementDto = z.infer<typeof entryMovementSchema>;

export const saleMovementSchema = BaseMovementSchema.omit({
  expirationDate: true,
  batchCode: true,
});
export type SaleMovementDto = z.infer<typeof saleMovementSchema>;

export const expirationMovementSchema = z.object(BaseMovementSchema.shape);
export type ExpirationMovementDto = z.infer<typeof expirationMovementSchema>;
