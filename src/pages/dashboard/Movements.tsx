import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  ShoppingCart,
  ArrowRight,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { Button, Table, Skeleton, Dialog, Input, Select, Loader } from "@/shared/components/ui";
import { Movement } from "@/shared/types/movement";
import { useListInventory } from "@/api/hooks/inventory";
import { EntryMovementForm, SaleMovementForm, ExitMovementForm, EditMovementForm } from "./components";
import { useListMovements, useDeleteMovement } from "@/api/hooks/movement";
import { InventoryItem } from "@/shared/types";
import { MovementType } from "@/shared/enum/movement-type.enum";

export function Movements() {
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null
  );
  const [productNameFilter, setProductNameFilter] = useState("");
  const [batchCodeFilter, setBatchCodeFilter] = useState("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<
    MovementType | "ALL"
  >("ALL");
  const { data: products, isLoading: isLoadingProducts } = useListInventory();
  const { data: movements, isLoading: isLoadingMovements } = useListMovements();
  const deleteMovement = useDeleteMovement();

  const isLoading = isLoadingProducts || isLoadingMovements;

  const getProductName = (itemId: number) => {
    const product = products?.data?.find(
      (product: InventoryItem) => product.id === itemId
    );
    return product?.name || "Producto no encontrado";
  };

  const getMovementType = (type: MovementType) => {
    return type === MovementType.ENTRY
      ? "Entrada"
      : type === MovementType.EXIT
      ? "Salida"
      : type === MovementType.SALE
      ? "Venta"
      : type === MovementType.EXPIRATION
      ? "Vencimiento"
      : type;
  };

  const handleDelete = async () => {
    if (selectedMovement) {
      await deleteMovement.mutateAsync(selectedMovement.id);
      setIsDeleteDialogOpen(false);
      setSelectedMovement(null);
    }
  };

  const filteredMovements = movements?.data?.filter((movement) => {
    const productName = getProductName(movement.itemId).toLowerCase();
    const batchCode = movement.batchCode.toLowerCase();
    const productNameFilterLower = productNameFilter.toLowerCase();
    const batchCodeFilterLower = batchCodeFilter.toLowerCase();

    const matchesProductName = productName.includes(productNameFilterLower);
    const matchesBatchCode = batchCode.includes(batchCodeFilterLower);  
    const matchesMovementType =
      movementTypeFilter === "ALL" || movement.type === movementTypeFilter;

    return matchesProductName && matchesBatchCode && matchesMovementType;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="border rounded-lg">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <div className="flex gap-2">
          <Dialog.Root
            open={isEntryDialogOpen}
            onOpenChange={setIsEntryDialogOpen}
          >
            <Dialog.Trigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Entrada de producto
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Nuevo Movimiento de Entrada</Dialog.Title>
              </Dialog.Header>
              <EntryMovementForm
                products={products?.data || []}
                onSuccess={() => {
                  setIsEntryDialogOpen(false);
                }}
              />
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root
            open={isExitDialogOpen}
            onOpenChange={setIsExitDialogOpen}
          >
            <Dialog.Trigger asChild>
              <Button variant="secondary">
                <ArrowRight className="mr-2 h-4 w-4" />
                Salida de producto
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Nuevo Movimiento de Salida</Dialog.Title>
              </Dialog.Header>
              <ExitMovementForm
                onSuccess={() => {
                  setIsExitDialogOpen(false);
                }}
              />
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root
            open={isSaleDialogOpen}
            onOpenChange={setIsSaleDialogOpen}
          >
            <Dialog.Trigger asChild>
              <Button variant="secondary">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Venta de producto
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Nuevo Movimiento de Venta</Dialog.Title>
              </Dialog.Header>
              <SaleMovementForm
                products={products?.data || []}
                onSuccess={() => {
                  setIsSaleDialogOpen(false);
                }}
              />
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de producto..."
            value={productNameFilter}
            onChange={(e) => setProductNameFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código de lote..."
            value={batchCodeFilter}
            onChange={(e) => setBatchCodeFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select.Root
          value={movementTypeFilter}
          onValueChange={(value) =>
            setMovementTypeFilter(value as MovementType | "ALL")
          }
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Tipo de movimiento" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="ALL">Todos los tipos</Select.Item>
            <Select.Item value={MovementType.ENTRY}>Entrada</Select.Item>
            <Select.Item value={MovementType.EXIT}>Salida</Select.Item>
            <Select.Item value={MovementType.SALE}>Venta</Select.Item>
            <Select.Item value={MovementType.EXPIRATION}>Vencimiento</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <div className="border rounded-sm">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Tipo</Table.Head>
              <Table.Head>Producto</Table.Head>
              <Table.Head>Lote</Table.Head>
              <Table.Head>Cantidad</Table.Head>
              <Table.Head>Costo Unitario</Table.Head>
              <Table.Head>Fecha de Expiración</Table.Head>
              <Table.Head>Descripción</Table.Head>
              <Table.Head>Acciones</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMovements?.map((movement: Movement) => (
              <Table.Row key={movement.id}>
                <Table.Cell>{getMovementType(movement.type)}</Table.Cell>
                <Table.Cell>{getProductName(movement.itemId)}</Table.Cell>
                <Table.Cell>{movement.batchCode}</Table.Cell>
                <Table.Cell>{movement.quantity}</Table.Cell>
                <Table.Cell>Bs.{movement.unitCost.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  {movement.expirationDate
                    ? format(movement.expirationDate, "PPP", {
                        locale: es,
                      })
                    : "Sin fecha de expiración"}
                </Table.Cell>
                <Table.Cell>{movement.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    {movement.type === MovementType.ENTRY && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={
                            movement.quantity !== movement.remainingQuantity
                          }
                          onClick={() => {
                            setSelectedMovement(movement);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={
                            movement.quantity !== movement.remainingQuantity
                          }
                          onClick={() => {
                            setSelectedMovement(movement);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Editar Movimiento</Dialog.Title>
          </Dialog.Header>
          {selectedMovement && (
            <EditMovementForm
              movement={selectedMovement}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedMovement(null);
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Eliminar Entrada</Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro de que deseas eliminar esta entrada? Esta acción no
              se puede deshacer.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button
              variant="outlineWhite"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedMovement(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMovement.isPending}
            >
              {deleteMovement.isPending ? (
                <Loader size="sm" message="Eliminando..." />
              ) : (
                "Eliminar"
              )}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
