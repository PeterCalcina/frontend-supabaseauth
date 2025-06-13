import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
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
} from '@/shared/components/ui/dialog';
import { EntryMovementForm } from './components/EntryMovementForm';
import { Movement } from '@/shared/types/movement';
import { useListInventory } from '@/api/hooks/inventory/useListInventory';
import { useListMovements } from '@/api/hooks/movement/useListMovements';

export function Movements() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: products, isLoading: isLoadingProducts } = useListInventory();
  const { data: movements, isLoading: isLoadingMovements } = useListMovements();

  const isLoading = isLoadingProducts || isLoadingMovements;

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements?.data?.map((movement: Movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.type}</TableCell>
                <TableCell>{movement.itemId}</TableCell>
                <TableCell>{movement.batchCode}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>Bs.{movement.unitCost.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(movement.expirationDate), 'PPP', {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{movement.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 