import {
  format,
  differenceInDays,
  startOfDay,
  isBefore,
  isAfter,
} from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button, Table, Badge } from "@/shared/components/ui";
import { Movement, InventoryItem } from "@/shared/types";
import { MovementType } from "@/shared/enum/movement-type.enum";
import {
  useCreateExpirationMovement,
  useListEntriesByExpirationDateMovements,
} from "@/api/hooks/movement";
import { useListInventory } from "@/api/hooks/inventory";
import { ExpiringStockTableSkeleton } from "./components/skeletons";

export function Expirations() {
  const { data: movements, isLoading: isLoadingMovements } =
    useListEntriesByExpirationDateMovements();
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

  const expiredProducts = movements?.data?.filter((movement: Movement) =>
    isBefore(new Date(movement.expirationDate), todayStart)
  );

  const soonToExpireProducts = movements?.data?.filter(
    (movement: Movement) =>
      isAfter(new Date(movement.expirationDate), todayStart) &&
      differenceInDays(new Date(movement.expirationDate), todayStart) <=
        DAYS_THRESHOLD
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos Vencidos</h2>
        {isLoading ? (
          <ExpiringStockTableSkeleton />
        ) : (
          <div className="border-zinc-500/20 border-2 rounded-sm">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Producto</Table.Head>
                  <Table.Head>Lote</Table.Head>
                  <Table.Head>Cantidad Restante</Table.Head>
                  <Table.Head>Fecha de Expiración</Table.Head>
                  <Table.Head>Estado</Table.Head>
                  <Table.Head>Acciones</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {expiredProducts?.map((movement: Movement) => (
                  <Table.Row key={movement.id}>
                    <Table.Cell>{getProductName(movement.itemId)}</Table.Cell>
                    <Table.Cell>{movement.batchCode}</Table.Cell>
                    <Table.Cell>{movement.remainingQuantity}</Table.Cell>
                    <Table.Cell>
                      {format(new Date(movement.expirationDate), "PPP", {
                        locale: es,
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="destructive">Vencido</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleExpire(movement)}
                        disabled={createExpirationMovement.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {expiredProducts?.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center">
                      No hay productos vencidos
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </div>

      {isLoading ? (
        <ExpiringStockTableSkeleton />
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Productos por Vencer</h2>
          <div className="border-zinc-500/20 border-2 rounded-sm">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Producto</Table.Head>
                  <Table.Head>Lote</Table.Head>
                  <Table.Head>Cantidad Restante</Table.Head>
                  <Table.Head>Fecha de Expiración</Table.Head>
                  <Table.Head>Estado</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {soonToExpireProducts?.map((movement: Movement) => (
                  <Table.Row key={movement.id}>
                    <Table.Cell>{getProductName(movement.itemId)}</Table.Cell>
                    <Table.Cell>{movement.batchCode}</Table.Cell>
                    <Table.Cell>{movement.remainingQuantity}</Table.Cell>
                    <Table.Cell>
                      {format(new Date(movement.expirationDate), "PPP", {
                        locale: es,
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="warning">
                        {differenceInDays(
                          new Date(movement.expirationDate),
                          new Date()
                        )}{" "}
                        días para vencer
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {soonToExpireProducts?.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center">
                      No hay productos próximos a vencer
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </div>
      )}
    </div>
  );
}
