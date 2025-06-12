import * as z from "zod";

export const createInventorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sku: z.string().min(1, "El SKU es requerido"),
  qty: z.number().min(0, "La cantidad debe ser mayor o igual a 0"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  lastEntry: z.date().optional(),
});

export type InventoryDto = z.infer<typeof createInventorySchema>;

export const updateInventorySchema = createInventorySchema.partial();
