import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, ShoppingCart, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { EntryMovementForm } from './components/EntryMovementForm';
import { SaleMovementForm } from './components/SaleMovementForm';
import { ExitMovementForm } from './components/ExitMovementForm';
import { EditMovementForm } from './components/EditMovementForm';
import { Movement } from '@/shared/types/movement';
import { useListInventory } from '@/api/hooks/inventory/useListInventory';
import { useListMovements } from '@/api/hooks/movement/useListMovements';
import { useDeleteMovement } from '@/api/hooks/movement/useDeleteMovement';
import { InventoryItem } from '@/shared/types/inventory';
import { MovementType } from '@/shared/enum/movement-type.enum';
import { Loader } from '@/shared/components/ui/loader';

export function Movements() {
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const { data: products, isLoading: isLoadingProducts } = useListInventory();
  const { data: movements, isLoading: isLoadingMovements } = useListMovements();
  const deleteMovement = useDeleteMovement();

  const isLoading = isLoadingProducts || isLoadingMovements;

  const getProductName = (itemId: number) => {
    const product = products?.data?.find((product: InventoryItem) => product.id === itemId);
    return product?.name || 'Producto no encontrado';
  };

  const getMovementType = (type: MovementType) => {
    return type === MovementType.ENTRY ? 'Entrada' : type === MovementType.EXIT ? 'Salida' : type === MovementType.SALE ? 'Venta' : type === MovementType.EXPIRATION ? 'Vencimiento' : type;
  };

  const handleDelete = async () => {
    if (selectedMovement) {
      await deleteMovement.mutateAsync(selectedMovement.id);
      setIsDeleteDialogOpen(false);
      setSelectedMovement(null);
    }
  };
  
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
          <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Entrada de producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento de Entrada</DialogTitle>
              </DialogHeader>
              <EntryMovementForm
                products={products?.data || []}
                onSuccess={() => {
                  setIsEntryDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <ArrowRight className="mr-2 h-4 w-4" />
                Salida de producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento de Salida</DialogTitle>
              </DialogHeader>
              <ExitMovementForm
                onSuccess={() => {
                  setIsExitDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Venta de producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento de Venta</DialogTitle>
              </DialogHeader>
              <SaleMovementForm
                products={products?.data || []}
                onSuccess={() => {
                  setIsSaleDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Costo Unitario</TableHead>
              <TableHead>Fecha de Expiración</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements?.data?.map((movement: Movement) => (
              <TableRow key={movement.id}>
                <TableCell>{getMovementType(movement.type)}</TableCell>
                <TableCell>{getProductName(movement.itemId)}</TableCell>
                <TableCell>{movement.batchCode}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>Bs.{movement.unitCost.toFixed(2)}</TableCell>
                <TableCell>
                  {
                    movement.expirationDate ? format(new Date(movement.expirationDate), 'PPP', {
                      locale: es,
                    }) : 'Sin fecha de expiración'
                  }
                </TableCell>
                <TableCell>{movement.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {movement.type === MovementType.ENTRY && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={movement.quantity !== movement.remainingQuantity}
                          onClick={() => {
                            setSelectedMovement(movement);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={movement.quantity !== movement.remainingQuantity}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Movimiento</DialogTitle>
          </DialogHeader>
          {selectedMovement && (
            <EditMovementForm
              movement={selectedMovement}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedMovement(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Entrada</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta entrada? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 