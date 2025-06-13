import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { InventoryItem } from "@/shared/types/inventory";
import { useCreateInventory } from "@/api/hooks/useCreateInventory";
import { useUpdateInventory } from "@/api/hooks/useUpdateInventory";
import {
  createInventorySchema,
  InventoryDto,
} from "@/shared/schemas/inventory.schema";
import { Loader } from "@/shared/components/ui/loader";
import { Status } from "@/shared/enum/status.enum";

interface ProductFormProps {
  product: InventoryItem | null;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const form = useForm<InventoryDto>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      profitMargin: product?.profitMargin ?? 0,
      qty: product?.qty ?? 0,
      cost: product?.cost ?? 0,
      status: product?.status ?? Status.ACTIVE,
    },
  });

  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();

  const isLoading = createInventory.isPending || updateInventory.isPending;

  const onSubmit = async (values: InventoryDto) => {
    if (product) {
      await updateInventory.mutateAsync({
        id: product.id,
        data: values,
      });
    } else {
      await createInventory.mutateAsync(values);
    }

    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profitMargin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Margen de Ganancia (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
    </Form>
  );
}
