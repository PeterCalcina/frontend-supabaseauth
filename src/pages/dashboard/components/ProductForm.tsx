import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Loader } from "@/shared/components/ui";
import { InventoryItem } from "@/shared/types/inventory";
import { useCreateInventory, useUpdateInventory } from "@/api/hooks/inventory";
import {
  createInventorySchema,
  CreateInventoryDto,
  UpdateInventoryDto,
  updateInventorySchema,
} from "@/shared/schemas/inventory.schema";

interface ProductFormProps {
  product: InventoryItem | null;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  type InventoryFormFields = CreateInventoryDto | UpdateInventoryDto;
  const form = product
    ? useForm<UpdateInventoryDto>({
        resolver: zodResolver(updateInventorySchema),
        defaultValues: {
          name: product.name,
          sku: product.sku,
          profitMargin: product.profitMargin,
        },
      })
    : (useForm<CreateInventoryDto>({
        resolver: zodResolver(createInventorySchema),
        defaultValues: {
          name: "",
          sku: "",
          profitMargin: 0,
        },
      }) as UseFormReturn<InventoryFormFields>);

  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();

  const isLoading = createInventory.isPending || updateInventory.isPending;

  const onSubmit = async (values: CreateInventoryDto | UpdateInventoryDto) => {
    if (product) {
      await updateInventory.mutateAsync({
        id: product.id,
        data: values as UpdateInventoryDto,
      });
    } else {
      await createInventory.mutateAsync(values as CreateInventoryDto);
    }

    onSuccess();
  };

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Nombre</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="sku"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>SKU</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="profitMargin"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Margen de Ganancia (%)</Form.Label>
              <Form.Control>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader size="sm" message="Guardando..." />
          ) : product ? (
            "Actualizar"
          ) : (
            "Crear"
          )}
        </Button>
      </form>
    </Form.Root>
  );
}
