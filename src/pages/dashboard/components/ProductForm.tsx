import { useForm, UseFormReturn } from "react-hook-form";
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
import { useCreateInventory } from "@/api/hooks/inventory/useCreateInventory";
import { useUpdateInventory } from "@/api/hooks/inventory/useUpdateInventory";
import {
  createInventorySchema,
  CreateInventoryDto,
  UpdateInventoryDto,
  updateInventorySchema,
} from "@/shared/schemas/inventory.schema";
import { Loader } from "@/shared/components/ui/loader";

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
  : useForm<CreateInventoryDto>({
      resolver: zodResolver(createInventorySchema),
      defaultValues: {
        name: "",
        sku: "",
        profitMargin: 0,
      },
    }) as UseFormReturn<InventoryFormFields>;


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
