import { useState } from 'react';
import { useCurrentStockReport } from '@/api/hooks/report/useReports';
import { GetCurrentStockDto } from '@/shared/schemas/report.schema';
import { Card, Input, Button, Loader, Table } from '@/shared/components/ui';
import { CurrentStockTableSkeleton } from './skeletons';

export function CurrentStockReport() {
  const [filters, setFilters] = useState<GetCurrentStockDto>({
    page: 1,
    pageSize: 5,
    itemName: '',
  });

  const { data, isLoading, isFetching, isError } = useCurrentStockReport(filters);

  const reportData = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;

  const handleSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      itemName: value,
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
            Ha ocurrido un error al cargar el reporte de stock actual.
          </Card.Description>
        </Card.Header>
      </Card.Root>
    );
  }

  return (
    <Card.Root className="p-6">
      <Card.Header>
        <Card.Title>Stock Actual</Card.Title>
        <Card.Description>
          Visualiza el inventario actual de productos
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre de producto..."
            onChange={(e) => handleSearch(e.target.value)}
            value={filters.itemName || ''}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
            <CurrentStockTableSkeleton />
        ) : (
          <div className="border-zinc-500/20 border-2 rounded-sm">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Nombre</Table.Head>
                  <Table.Head>Cantidad Total</Table.Head>
                  <Table.Head>Costo Promedio (Bs.)</Table.Head>
                  <Table.Head>Valor Total (Bs.)</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {reportData.length > 0 ? (
                  reportData.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.totalQuantity}</Table.Cell>
                      <Table.Cell>{item.unitCost.toFixed(2)}</Table.Cell>
                      <Table.Cell>{item.currentTotalValue.toFixed(2)}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center text-muted-foreground py-4">
                      No se encontraron resultados.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground pl-5">
                Mostrando {reportData.length} de {totalItems} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outlineWhite"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
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
          </div>
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