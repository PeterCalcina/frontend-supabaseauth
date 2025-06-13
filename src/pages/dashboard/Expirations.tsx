import { format, differenceInDays, startOfDay, isBefore, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Movement } from "@/shared/types/movement";
import { MovementType } from "@/shared/enum/movement-type.enum";
import { InventoryItem } from "@/shared/types/inventory";
import { useCreateExpirationMovement } from "@/api/hooks/movement/useCreateExpirationMovement";
import { useListInventory } from "@/api/hooks/inventory/useListInventory";
import { useListEntriesByExpirationDateMovements } from "@/api/hooks/movement/useListEntriesExpirationMovements";

export function Expirations() {
  const { data: movements, isLoading: isLoadingMovements } = useListEntriesByExpirationDateMovements();
  const { data: products, isLoading: isLoadingProducts } = useListInventory();
  const createExpirationMovement = useCreateExpirationMovement();

  console.log(movements);

  const isLoading = isLoadingMovements || isLoadingProducts;

  const getProductName = (itemId: number) => {
    const product = products?.data?.find(
      (product: InventoryItem) => product.id === itemId
    );
    return product?.name || "Producto no encontrado";
  };

  const handleExpire = async (movement: Movement) => {
    await createExpirationMovement.mutateAsync({
      ...movement,
      type: MovementType.EXPIRATION,
      description: `Producto vencido, removiendo ${movement.remainingQuantity} unidades`,
      quantity: movement.remainingQuantity,
    });
  };

  const todayStart = startOfDay(new Date());
  const DAYS_THRESHOLD = 10;

  const expiredProducts = movements?.data?.filter(
    (movement: Movement) =>
      isBefore(new Date(movement.expirationDate), todayStart)
  );

  const soonToExpireProducts = movements?.data?.filter(
    (movement: Movement) =>
      isAfter(new Date(movement.expirationDate), todayStart) &&
      differenceInDays(new Date(movement.expirationDate), todayStart) <= DAYS_THRESHOLD
    );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="border rounded-lg">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos Vencidos</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Cantidad Restante</TableHead>
                <TableHead>Fecha de Expiración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredProducts?.map((movement: Movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{getProductName(movement.itemId)}</TableCell>
                  <TableCell>{movement.batchCode}</TableCell>
                  <TableCell>{movement.remainingQuantity}</TableCell>
                  <TableCell>
                    {format(new Date(movement.expirationDate), "PPP", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">Vencido</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExpire(movement)}
                      disabled={createExpirationMovement.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {expiredProducts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay productos vencidos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Productos por Vencer</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Cantidad Restante</TableHead>
                <TableHead>Fecha de Expiración</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soonToExpireProducts?.map((movement: Movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{getProductName(movement.itemId)}</TableCell>
                  <TableCell>{movement.batchCode}</TableCell>
                  <TableCell>{movement.remainingQuantity}</TableCell>
                  <TableCell>
                    {format(new Date(movement.expirationDate), "PPP", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">
                      {differenceInDays(
                        new Date(movement.expirationDate),
                        new Date()
                      )}{" "}
                      días para vencer
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {soonToExpireProducts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay productos próximos a vencer
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
