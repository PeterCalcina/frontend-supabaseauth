import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Loader, Select } from "@/shared/components/ui";
import { InventoryItem } from "@/shared/types/inventory";
import { saleMovementSchema, SaleMovementDto } from "@/shared/schemas/movement.schema";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useGetInventory } from "@/api/hooks/inventory";
import { useCreateSaleMovement } from "@/api/hooks/movement";

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
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Form.Field
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Producto</Form.Label>
              <Select.Root onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecciona el producto" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content className="bg-background">
                  {products.map((product) => (
                    <Select.Item key={product.id} value={product.id.toString()}>
                      {product.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Form.Message />
            </Form.Item>
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

        <Form.Field
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control>
                <Input
                  type="number"
                  min="1"
                  max={inventory?.data?.qty}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Detalle de la venta</Form.Label>
              <Form.Control>
                <Input {...field} readOnly />
              </Form.Control>
              <Form.Message />
            </Form.Item>
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
    </Form.Root>
  );
} 