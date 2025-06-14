import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table } from "@/shared/components/ui/table"

export function InventoryTableSkeleton() {
  return (
    <div className="border-zinc-500/20 border-2 rounded-sm">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nombre</Table.Head>
            <Table.Head>SKU</Table.Head>
            <Table.Head>Cantidad</Table.Head>
            <Table.Head>Costo</Table.Head>
            <Table.Head>Margen de Ganancia</Table.Head>
            <Table.Head>Última Entrada</Table.Head>
            <Table.Head>Acciones</Table.Head>
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
                <Skeleton className="h-5 w-12" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-24" />
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  <Skeleton className="h-8 w-10 rounded-md" />
                  <Skeleton className="h-8 w-10 rounded-md" />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}