import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table } from "@/shared/components/ui/table";

export function MovementHistoryTableSkeleton() {
  return (
    <div className="border-zinc-500/20 border-2 rounded-sm">
      <Table.Root>
        <Table.Header>
          <Table.Row className="bg-gray-50">
            <Table.Head className="font-semibold">Tipo</Table.Head>
            <Table.Head className="font-semibold">
              Nombre de Producto
            </Table.Head>
            <Table.Head className="font-semibold">Cantidad</Table.Head>
            <Table.Head className="font-semibold">Costo Unitario</Table.Head>
            <Table.Head className="font-semibold">Fecha</Table.Head>
            <Table.Head className="font-semibold">Lote</Table.Head>
            <Table.Head className="font-semibold">Descripción</Table.Head>
            <Table.Head className="font-semibold">F. Vencimiento</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Skeleton className="h-5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-32" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-12" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-20" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-24" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-32" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-24" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
