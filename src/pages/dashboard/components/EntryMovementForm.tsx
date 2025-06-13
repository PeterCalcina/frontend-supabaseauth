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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { InventoryItem } from "@/shared/types/inventory";
import { useCreateEntryMovement } from "@/api/hooks/movement/useCreateEntryMovement";
import { entryMovementSchema, EntryMovementDto } from "@/shared/schemas/movement.schema";
import { Loader } from "@/shared/components/ui/loader";
import { useEffect, useState } from "react";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useGetInventory } from "@/api/hooks/inventory/useGetInventory";
import { Checkbox } from "@/shared/components/ui/checkbox";

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
    const data = {
      ...values,
      expirationDate: hasExpirationDate ? values.expirationDate : undefined,
    };
    await createEntryMovement.mutateAsync(data);
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

        <FormField
          control={form.control}
          name="batchCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Lote</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="unitCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo Unitario</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Expiración</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
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
    </Form>
  );
} 