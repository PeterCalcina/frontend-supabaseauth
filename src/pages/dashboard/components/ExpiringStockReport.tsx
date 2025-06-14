import { useState } from 'react';
import { useExpiringStockReport } from '@/api/hooks/report/useReports';
import { GetExpiringStockDto } from '@/shared/schemas/report.schema';
import { Card, Input, Button, Loader, Skeleton, Select, Table, Badge } from '@/shared/components/ui';
import { format } from 'date-fns';

export function ExpiringStockReport() {
  const [filters, setFilters] = useState<GetExpiringStockDto>({
    status: 'expired',
    page: 1,
    pageSize: 5,
    daysUntilExpiration: 10,
  });

  const { data, isLoading, isFetching, isError } = useExpiringStockReport(filters);
  const currentPage: number = data?.page ?? filters.page ?? 1;

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value as GetExpiringStockDto['status'],
      page: 1,
    }));
  };

  const handleDaysChange = (value: string) => {
    const days = parseInt(value);
    if (!isNaN(days)) {
      setFilters(prev => ({
        ...prev,
        daysUntilExpiration: days,
        page: 1,
      }));
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const calculateDaysUntilExpiration = (expirationDate: Date) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isError) {
    return (
      <Card.Root className="p-6">
        <Card.Header>
          <Card.Title>Error</Card.Title>
          <Card.Description>
            Ha ocurrido un error al cargar el reporte de stock por vencer.
          </Card.Description>
        </Card.Header>
      </Card.Root>
    );
  }

  return (
    <Card.Root className="p-6">
      <Card.Header>
        <Card.Title>Stock por Vencer</Card.Title>
        <Card.Description>
          Visualiza los productos próximos a vencer o vencidos
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-wrap gap-4 mb-6">
          <Select.Root
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="Estado" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="expired">Vencidos</Select.Item>
              <Select.Item value="expiring-soon">Por Vencer</Select.Item>
            </Select.Content>
          </Select.Root>

          <Input
            type="number"
            placeholder="Días hasta vencimiento..."
            value={filters.daysUntilExpiration}
            onChange={(e) => handleDaysChange(e.target.value)}
            className="max-w-[200px]"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>ID Producto</Table.Head>
                  <Table.Head>Nombre de Producto</Table.Head>
                  <Table.Head>Lote</Table.Head>
                  <Table.Head>Cantidad Restante</Table.Head>
                  <Table.Head>Fecha de Vencimiento</Table.Head>
                  <Table.Head>Días para Vencer</Table.Head>
                  <Table.Head>Estado</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data?.data?.map((item) => {
                  const daysUntilExpiration = calculateDaysUntilExpiration(item.expirationDate);
                  const isExpired = daysUntilExpiration < 0;

                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.productId}</Table.Cell>
                      <Table.Cell>{item.productName}</Table.Cell>
                      <Table.Cell>{item.batchCode}</Table.Cell>
                      <Table.Cell>{item.remainingQuantity}</Table.Cell>
                      <Table.Cell>{format(item.expirationDate, 'dd/MM/yyyy')}</Table.Cell>
                      <Table.Cell>{
                        isExpired ? 'Vencido' : Math.abs(daysUntilExpiration)
                        }</Table.Cell>
                      <Table.Cell>
                        <Badge
                          variant={isExpired ? "destructive" : "warning"}
                        >
                          {isExpired ? "Vencido" : "Por Vencer"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {data?.data.length} de {data?.total} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage >= (data?.totalPages || 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}

        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader size="sm" />
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
} 