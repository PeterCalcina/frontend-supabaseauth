import { useState } from 'react';
import { useMovementHistoryReport } from '@/api/hooks/report/useReports';
import { GetMovementHistoryDto } from '@/shared/schemas/report.schema';
import { MovementType } from '@/shared/enum/movement-type.enum';
import { Card, Input, Button, Loader, Skeleton, Select, Table } from '@/shared/components/ui';
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
  const currentPage: number = data?.page ?? filters.page ?? 1;
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

          <Select.Root
            value={filters.movementType || 'ALL_TYPES_OPTION'}
            onValueChange={handleMovementTypeChange}
          >
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="Tipo de movimiento" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="ALL_TYPES_OPTION">Todos</Select.Item>
              {Object.values(MovementType).map(type => (
                <Select.Item key={type} value={type}>
                  {type === 'ENTRY' ? 'Entrada' : type === 'EXIT' ? 'Salida' : type === 'SALE' ? 'Venta' : type === 'EXPIRATION' ? 'Vencimiento' : type}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

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
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Tipo</Table.Head>
                  <Table.Head>Nombre de Producto</Table.Head>
                  <Table.Head>Cantidad</Table.Head>
                  <Table.Head>Costo Unitario</Table.Head>
                  <Table.Head>Fecha</Table.Head>
                  <Table.Head>Lote</Table.Head>
                  <Table.Head>Descripción</Table.Head>
                  <Table.Head>F. Vencimiento</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {movementHistoryData.length > 0 ? (
                  movementHistoryData.map((movement) => (
                    <Table.Row key={movement.id}>
                      <Table.Cell>{movement.type}</Table.Cell>
                      <Table.Cell>{movement.productName || 'N/A'}</Table.Cell>
                      <Table.Cell>{movement.quantity}</Table.Cell>
                      <Table.Cell>{movement.unitCost?.toFixed(2) || 'N/A'}</Table.Cell>
                      <Table.Cell>
                        {movement.createdAt ? format(movement.createdAt, 'dd/MM/yyyy') : 'N/A'}
                      </Table.Cell>
                      <Table.Cell>{movement.batchCode || 'N/A'}</Table.Cell>
                      <Table.Cell>{movement.description || 'N/A'}</Table.Cell>
                      <Table.Cell>
                        {movement.expirationDate ? format(movement.expirationDate, 'dd/MM/yyyy') : 'Sin fecha'}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={9} className="text-center text-muted-foreground py-4">
                      No se encontraron resultados.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {movementHistoryData.length} de {totalItems} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outlineWhite"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isFetching}
                >
                  Anterior
                </Button>
                <Button
                  variant="outlineWhite"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isFetching}
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