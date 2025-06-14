import { useState } from "react";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Table, Skeleton, Dialog } from "@/shared/components/ui";
import { ProductForm } from "./components";
import { InventoryItem } from "@/shared/types";
import { useListInventory, useDeleteInventory } from "@/api/hooks/inventory";

export function Inventory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null
  );
  const { data: products, isLoading } = useListInventory();
  const deleteInventory = useDeleteInventory();

  const handleEdit = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      await deleteInventory.mutateAsync(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-dark-blue">Inventario</h1>
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
              </Dialog.Title>
            </Dialog.Header>
            <ProductForm
              product={selectedProduct}
              onSuccess={() => {
                setIsDialogOpen(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Root>
      </div>

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
              <Table.Head className="text-right">Acciones</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products?.data?.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.sku}</Table.Cell>
                <Table.Cell>{product.qty}</Table.Cell>
                <Table.Cell>Bs.{product.cost.toFixed(2)}</Table.Cell>
                <Table.Cell>{product.profitMargin}%</Table.Cell>
                <Table.Cell>
                  {product.lastEntry && isValid(new Date(product.lastEntry))
                    ? format(new Date(product.lastEntry), "PPP", {
                        locale: es,
                      })
                    : "Sin fecha"}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>¿Eliminar producto?</Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              {selectedProduct?.name}? Esta acción no se puede deshacer.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button
              variant="outlineWhite"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInventory.isPending}
            >
              {deleteInventory.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
