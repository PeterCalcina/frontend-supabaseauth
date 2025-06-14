import { useState } from 'react';
import { useCurrentStockReport } from '@/api/hooks/report/useReports';
import { GetCurrentStockDto } from '@/shared/schemas/report.schema';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader } from '@/shared/components/ui/loader';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

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
      page: 1, // Reset to first page on new search
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
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cantidad Total</TableHead>
                  <TableHead>Costo Promedio (Bs.)</TableHead>
                  <TableHead>Valor Total (Bs.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? ( // Verifica si hay datos antes de mapear
                  reportData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.unitCost.toFixed(2)}</TableCell>
                      <TableCell>{item.currentTotalValue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {reportData.length} de {totalItems} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching} // Deshabilitar si se está cargando
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isFetching} // Deshabilitar si se está cargando
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Overlay de isFetching (solo si no es la carga inicial) */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
            <Loader size="sm" /> {/* O tu spinner de carga */}
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
} 