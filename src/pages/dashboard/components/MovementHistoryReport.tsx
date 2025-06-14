import { useState } from 'react';
import { useMovementHistoryReport } from '@/api/hooks/report/useReports';
import { GetMovementHistoryDto } from '@/shared/schemas/report.schema';
import { MovementType } from '@/shared/enum/movement-type.enum';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader } from '@/shared/components/ui/loader';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

import { format, isValid, subDays, addDays } from 'date-fns';

export function MovementHistoryReport() {
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  const tomorrow = addDays(today, 1);

  const [filters, setFilters] = useState<GetMovementHistoryDto>({
    startDate: oneWeekAgo,
    endDate: tomorrow,
    page: 1,
    pageSize: 5,
    movementType: undefined,
    batchCode: undefined,
  });

  const { data, isLoading, isFetching, isError, error } = useMovementHistoryReport(filters);

  const movementHistoryData = data?.data || [];
  const totalItems = data?.total || 0;
  const currentPage = data?.page || filters.page;
  const totalPages = data?.totalPages || 1;

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const parsedDate = new Date(value);

    if (!isValid(parsedDate)) {
        console.error(`Invalid date selected for ${field}: ${value}`);
        return;
    }

    setFilters(prev => ({
      ...prev,
      [field]: parsedDate,
      page: 1,
    }));
  };

  const handleMovementTypeChange = (value: string) => {
    const typeValue = value === 'ALL_TYPES_OPTION' ? undefined : (value as MovementType);
    setFilters(prev => ({
      ...prev,
      movementType: typeValue,
      page: 1,
    }));
  };

  const handleBatchCodeSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      batchCode: value === '' ? undefined : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  if (isError) {
    return (
      <Card.Root className="p-6">
        <Card.Header>
          <Card.Title>Error al Cargar Reporte</Card.Title>
          <Card.Description>
            Ha ocurrido un error al cargar el historial de movimientos.
            <br />
            Detalles: {error?.message || 'Error desconocido.'}
          </Card.Description>
        </Card.Header>
      </Card.Root>
    );
  }

  return (
    <Card.Root className="p-6">
      <Card.Header>
        <Card.Title>Historial de Movimientos</Card.Title>
        <Card.Description>
          Visualiza el historial de movimientos de inventario
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <Input
              type="date"
              value={format(filters.startDate, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="max-w-[200px]"
            />
            <Input
              type="date"
              value={format(filters.endDate, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="max-w-[200px]"
            />
          </div>

          <Select
            value={filters.movementType || 'ALL_TYPES_OPTION'}
            onValueChange={handleMovementTypeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de movimiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_TYPES_OPTION">Todos</SelectItem>
              {Object.values(MovementType).map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'ENTRY' ? 'Entrada' : type === 'EXIT' ? 'Salida' : type === 'SALE' ? 'Venta' : type === 'EXPIRATION' ? 'Vencimiento' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Buscar por código de lote..."
            value={filters.batchCode || ''}
            onChange={(e) => handleBatchCodeSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Movimiento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre de Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo Unitario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>F. Vencimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movementHistoryData.length > 0 ? (
                  movementHistoryData.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{movement.id}</TableCell>
                      <TableCell>{movement.type}</TableCell>
                      <TableCell>{movement.productName || 'N/A'}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.unitCost?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {movement.date ? format(movement.date, 'dd/MM/yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>{movement.batchCode || 'N/A'}</TableCell>
                      <TableCell>{movement.description || 'N/A'}</TableCell>
                      <TableCell>
                        {movement.expirationDate ? format(movement.expirationDate, 'dd/MM/yyyy') : 'Sin fecha'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {movementHistoryData.length} de {totalItems} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage! - 1)}
                  disabled={currentPage! === 1 || isFetching}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage! + 1)}
                  disabled={currentPage! >= totalPages || isFetching}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}

        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
            <Loader size="sm" />
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
}