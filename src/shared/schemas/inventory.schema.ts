import * as z from "zod";
import { Status } from "@/shared/enum/status.enum";

export const createInventorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sku: z.string().min(1, "El SKU es requerido"),
  profitMargin: z.number().min(0, "El margen de ganancia es requerido"),
  qty: z.number().min(0, "La cantidad es requerida"),
  cost: z.number().min(0, "El costo es requerido"),
  status: z.nativeEnum(Status),
  lastEntry: z.date().optional(),
});

export type InventoryDto = z.infer<typeof createInventorySchema>;

export const updateInventorySchema = createInventorySchema.partial();
