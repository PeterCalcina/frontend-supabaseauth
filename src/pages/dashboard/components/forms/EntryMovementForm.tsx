import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Select, Textarea, Loader, Checkbox } from "@/shared/components/ui";
import { InventoryItem } from "@/shared/types";
import { useCreateEntryMovement } from "@/api/hooks/movement";
import { entryMovementSchema, EntryMovementDto } from "@/shared/schemas/movement.schema";
import { useEffect, useState } from "react";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useGetInventory } from "@/api/hooks/inventory";

interface EntryMovementFormProps {
  products: InventoryItem[];
  onSuccess: () => void;
}

export function EntryMovementForm({ products, onSuccess }: EntryMovementFormProps) {
  const [hasExpirationDate, setHasExpirationDate] = useState(true);
  const form = useForm<EntryMovementDto>({
    resolver: zodResolver(entryMovementSchema),
    defaultValues: {
      type: MovementType.ENTRY,
      batchCode: "",
      quantity: 1,
      unitCost: 0,
      expirationDate: undefined,
      itemId: 0,
      description: "",
    },
  });

  const createEntryMovement = useCreateEntryMovement();
  const { data: inventory } = useGetInventory(form.watch("itemId"));
  const isLoading = createEntryMovement.isPending;

  useEffect(() => {
    const quantity = form.watch("quantity");
    const product = inventory?.data;

    if (quantity && product) {
      form.setValue(
        "description",
        `Entran ${quantity} productos de ${product.name}`
      );
    }
  }, [form.watch("quantity"), form.watch("itemId")]);

  const onSubmit = async (values: EntryMovementDto) => {
    if(values.expirationDate && values.expirationDate < new Date()) {
      form.setError("expirationDate", {
        message: "La fecha de expiración no puede ser anterior a la fecha actual"
      });
      return;
    }
    const data = {
      ...values,
      expirationDate: hasExpirationDate ? values.expirationDate : undefined,
    };
    await createEntryMovement.mutateAsync(data);
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

        <Form.Field
          control={form.control}
          name="batchCode"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Código de Lote</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

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
          name="unitCost"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Costo Unitario</Form.Label>
              <Form.Control>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasExpirationDate"
              checked={hasExpirationDate}
              onCheckedChange={(checked: boolean) => {
                setHasExpirationDate(checked);
                if (!checked) {
                  form.setValue("expirationDate", undefined);
                } else {
                  form.setValue("expirationDate", new Date());
                }
              }}
            />
            <label
              htmlFor="hasExpirationDate"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tiene fecha de expiración
            </label>
          </div>

          {hasExpirationDate && (
            <Form.Field
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                  <Form.Item>
                  <Form.Label>Fecha de Expiración</Form.Label>
                  <Form.Control>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          )}
        </div>

        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Descripción</Form.Label>
              <Form.Control>
                <Textarea {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader size="sm" message="Registrando..." />
          ) : (
            "Registrar Entrada"
          )}
        </Button>
      </form>
    </Form.Root>
  );
} 