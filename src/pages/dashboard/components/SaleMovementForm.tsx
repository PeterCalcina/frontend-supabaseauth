import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { InventoryItem } from "@/shared/types/inventory";
import { saleMovementSchema, SaleMovementDto } from "@/shared/schemas/movement.schema";
import { Loader } from "@/shared/components/ui/loader";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useGetInventory } from "@/api/hooks/inventory/useGetInventory";
import { useCreateSaleMovement } from "@/api/hooks/movement/useCreateSaleMovement";

interface SaleMovementFormProps {
  products: InventoryItem[];
  onSuccess: () => void;
}

export function SaleMovementForm({ products, onSuccess }: SaleMovementFormProps) {
  const form = useForm<SaleMovementDto>({
    resolver: zodResolver(saleMovementSchema),
    defaultValues: {
      type: MovementType.SALE,
      itemId: 0,
      quantity: 1,
      description: "",
      unitCost: 0,
    },
  });

  const createSaleMovement = useCreateSaleMovement();
  const { data: inventory } = useGetInventory(form.watch("itemId"));
  const isLoading = createSaleMovement.isPending;

  useEffect(() => {
    const quantity = form.watch("quantity");
    const product = inventory?.data;

    console.log(product);

    if (quantity && product) {
      const constoFinal = calculateFinalCost(product);
      const total = quantity * constoFinal;
      form.setValue("unitCost", constoFinal);
      form.setValue(
        "description",
        `Venta de ${quantity} productos de ${product.name} a Bs.${total.toFixed(2)}`
      );
    }
  }, [form.watch("quantity"), form.watch("itemId")]);

  const calculateFinalCost = ({ cost, profitMargin }: InventoryItem) => {
    const constoFinal = cost * (1 + (profitMargin / 100));
    return constoFinal;
  }

  const onSubmit = async (values: SaleMovementDto) => {
    await createSaleMovement.mutateAsync(values);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {inventory?.data && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Stock disponible</p>
              <p className="text-2xl font-bold">{inventory.data.qty}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Precio unitario</p>
              <p className="text-2xl font-bold">Bs.{calculateFinalCost(inventory.data).toFixed(2)}</p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={inventory?.data?.qty}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalle de la venta</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading || inventory?.data?.qty === 0}>
          {isLoading ? (
            <Loader size="sm" message="Registrando..." />
          ) : (
            "Registrar Venta"
          )}
        </Button>
      </form>
    </Form>
  );
} 