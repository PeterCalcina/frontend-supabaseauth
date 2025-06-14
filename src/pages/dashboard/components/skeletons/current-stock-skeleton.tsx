import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table } from "@/shared/components/ui/table";

export function CurrentStockTableSkeleton() {
  return (
    <div className="border-zinc-500/20 border-2 rounded-sm">
      <Table.Root>
        <Table.Header>
          <Table.Row className="bg-gray-50">
            <Table.Head className="font-semibold">Nombre</Table.Head>
            <Table.Head className="font-semibold">Cantidad Total</Table.Head>
            <Table.Head className="font-semibold">  
              Costo Promedio (Bs.)
            </Table.Head>
            <Table.Head className="font-semibold">Valor Total (Bs.)</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Skeleton className="h-5 w-32" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-24" />
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
