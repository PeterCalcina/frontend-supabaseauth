import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Textarea, Loader, Checkbox } from "@/shared/components/ui";
import { Movement } from "@/shared/types";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useUpdateMovement } from "@/api/hooks/movement";
import { entryMovementSchema, EntryMovementDto } from "@/shared/schemas/movement.schema";
import { useState } from "react";

interface EditMovementFormProps {
  movement: Movement;
  onSuccess: () => void;
}

export function EditMovementForm({
  movement,
  onSuccess,
}: EditMovementFormProps) {
  const [hasExpirationDate, setHasExpirationDate] = useState(
    !!movement.expirationDate
  );

  const form = useForm<EntryMovementDto>({
    resolver: zodResolver(entryMovementSchema),
    defaultValues: {
      type: MovementType.ENTRY,
      batchCode: movement.batchCode,
      quantity: movement.quantity,
      unitCost: movement.unitCost,
      expirationDate: movement.expirationDate
        ? new Date(movement.expirationDate)
        : undefined,
      itemId: movement.itemId,
      description: movement.description,
    },
  });

  const updateMovement = useUpdateMovement();
  const isLoading = updateMovement.isPending;

  const onSubmit = async (values: EntryMovementDto) => {
    const data = {
      ...values,
      expirationDate: hasExpirationDate ? values.expirationDate : undefined,
    };
    await updateMovement.mutateAsync({
      id: movement.id,
      ...data,
      remainingQuantity: data.quantity,
    });
    onSuccess();
  };

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
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
            <Loader size="sm" message="Actualizando..." />
          ) : (
            "Actualizar Movimiento"
          )}
        </Button>
      </form>
    </Form.Root>
  );
}
