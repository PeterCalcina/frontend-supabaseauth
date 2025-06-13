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
import { Movement } from "@/shared/types/movement";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { useCreateExitMovement } from "@/api/hooks/movement/useCreateExitMovement";
import { Loader } from "@/shared/components/ui/loader";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  exitMovementSchema,
  ExitMovementDto,
} from "@/shared/schemas/movement.schema";
import { useGetInventory } from "@/api/hooks/inventory/useGetInventory";
import { useListEntriesMovements } from "@/api/hooks/movement/useListEntriesMovements";

interface ExitMovementFormProps {
  onSuccess: () => void;
}

export function ExitMovementForm({ onSuccess }: ExitMovementFormProps) {
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null
  );
  const { data: movements } = useListEntriesMovements();

  const form = useForm<ExitMovementDto>({
    resolver: zodResolver(exitMovementSchema),
    defaultValues: {
      type: MovementType.EXIT,
      batchCode: "",
      quantity: 1,
      unitCost: 0,
      itemId: 0,
      description: "",
      remainingQuantity: 0,
    },
  });

  const createExitMovement = useCreateExitMovement();
  const { data: inventory } = useGetInventory(form.watch("itemId"));
  const isLoading = createExitMovement.isPending;

  useEffect(() => {
    const batchCode = form.watch("batchCode");
    const exitQuantity = form.watch("quantity");

    const movement = movements?.data?.find((m) => m.batchCode === batchCode);
    setSelectedMovement(movement || null);

    if (movement) {
      form.setValue("itemId", movement.itemId);
      form.setValue("unitCost", movement.unitCost);
      form.setValue("remainingQuantity", movement.remainingQuantity);

      if (exitQuantity && exitQuantity > 0) {
        form.setValue(
          "description",
          `Salida de ${exitQuantity} productos del lote ${movement.batchCode}`
        );
      } else {
        form.setValue(
          "description",
          `Salida de productos del lote ${movement.batchCode}`
        );
      }
    }
  }, [
    form.watch("batchCode"),
    form.watch("itemId"),
    form.watch("quantity"),
    movements?.data,
  ]);

  const onSubmit = async (values: ExitMovementDto) => {
    await createExitMovement.mutateAsync(values);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batchCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lote</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el lote" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movements?.data
                    ?.filter((m) => m.remainingQuantity > 0)
                    .map((movement) => (
                      <SelectItem key={movement.id} value={movement.batchCode}>
                        {movement.batchCode}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMovement && (
          <div className="space-y-2 p-4 border rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Producto:</span>{" "}
              {inventory?.data?.name}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Cantidad disponible:</span>{" "}
              {selectedMovement.remainingQuantity}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Costo unitario:</span> Bs.
              {selectedMovement.unitCost.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Fecha de vencimiento:</span>{" "}
              {selectedMovement.expirationDate
                ? format(new Date(selectedMovement.expirationDate), "PPP", {
                    locale: es,
                  })
                : "Sin fecha de expiración"}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad a retirar</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={selectedMovement?.remainingQuantity || 1}
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
            <Loader message="Registrando salida..." className="mr-2" />
          ) : (
            "Registrar Salida"
          )}
        </Button>
      </form>
    </Form>
  );
}
