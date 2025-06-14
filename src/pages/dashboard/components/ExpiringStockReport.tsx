import { useState } from 'react';
import { useExpiringStockReport } from '@/api/hooks/report/useReports';
import { GetExpiringStockDto } from '@/shared/schemas/report.schema';
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
import { Badge } from '@/shared/components/ui/badge';
import { format } from 'date-fns';

export function ExpiringStockReport() {
  const [filters, setFilters] = useState<GetExpiringStockDto>({
    status: 'expired',
    page: 1,
    pageSize: 5,
    daysUntilExpiration: 10,
  });

  const { data, isLoading, isFetching, isError } = useExpiringStockReport(filters);

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
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expired">Vencidos</SelectItem>
              <SelectItem value="expiring-soon">Por Vencer</SelectItem>
            </SelectContent>
          </Select>

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Producto</TableHead>
                  <TableHead>Nombre de Producto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Cantidad Restante</TableHead>
                  <TableHead>Fecha de Vencimiento</TableHead>
                  <TableHead>Días para Vencer</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((item) => {
                  const daysUntilExpiration = calculateDaysUntilExpiration(item.expirationDate);
                  const isExpired = daysUntilExpiration < 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.batchCode}</TableCell>
                      <TableCell>{item.remainingQuantity}</TableCell>
                      <TableCell>{format(item.expirationDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{
                        isExpired ? 'Vencido' : Math.abs(daysUntilExpiration)
                        }</TableCell>
                      <TableCell>
                        <Badge
                          variant={isExpired ? "destructive" : "warning"}
                        >
                          {isExpired ? "Vencido" : "Por Vencer"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {data?.data.length} de {data?.total} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page! === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! + 1)} 
                  disabled={filters.page! >= (data?.totalPages! || 1)}
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