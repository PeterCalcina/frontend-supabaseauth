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

export const exitMovementSchema = BaseMovementSchema.omit({
  expirationDate: true,
}).extend({
  quantity: z.number().min(1, "La cantidad es requerida"),
  remainingQuantity: z.number().min(0),
}).superRefine((data, ctx) => {
  if (data.quantity > data.remainingQuantity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La cantidad no puede ser mayor a la cantidad disponible",
      path: ["quantity"],
    });
  }
});
export type ExitMovementDto = z.infer<typeof exitMovementSchema>;

export const expirationMovementSchema = BaseMovementSchema.omit({
  unitCost: true,
});
export type ExpirationMovementDto = z.infer<typeof expirationMovementSchema>;

export const updateMovementSchema = z.object(BaseMovementSchema.shape).extend({
  remainingQuantity: z.number().min(0),
});
export type UpdateMovementDto = z.infer<typeof updateMovementSchema>;