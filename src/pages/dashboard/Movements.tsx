import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { ProductForm } from './components/ProductForm';
import { Movement } from '@/shared/types/movement';

export function Movements() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Movement | null>(null);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return <div>Movements</div>;

  // const { data: products, isLoading } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: productService.list,
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: productService.delete,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['products'] });
  //     addToast('success', 'Producto eliminado correctamente');
  //   },
  //   onError: (error) => {
  //     addToast('error', 'Error al eliminar el producto');
  //     console.error(error);
  //   },
  // });

  // const handleEdit = (product: Product) => {
  //   setSelectedProduct(product);
  //   setIsDialogOpen(true);
  // };

  // const handleCreate = () => {
  //   setSelectedProduct(null);
  //   setIsDialogOpen(true);
  // };

  // if (isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="flex justify-between items-center">
  //         <Skeleton className="h-8 w-[200px]" />
  //         <Skeleton className="h-10 w-[100px]" />
  //       </div>
  //       <div className="border rounded-lg">
  //         <Skeleton className="h-[400px]" />
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="space-y-4">
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-bold">Inventario</h1>
  //       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  //         <DialogTrigger asChild>
  //           <Button onClick={handleCreate}>
  //             <Plus className="mr-2 h-4 w-4" />
  //             Nuevo Producto
  //           </Button>
  //         </DialogTrigger>
  //         <DialogContent>
  //           <DialogHeader>
  //             <DialogTitle>
  //               {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
  //             </DialogTitle>
  //           </DialogHeader>
  //           <ProductForm
  //             product={selectedProduct}
  //             onSuccess={() => {
  //               setIsDialogOpen(false);
  //               queryClient.invalidateQueries({ queryKey: ['products'] });
  //               addToast('success', 'Producto guardado correctamente');
  //             }}
  //           />
  //         </DialogContent>
  //       </Dialog>
  //     </div>

  //     <div className="border rounded-lg">
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>Nombre</TableHead>
  //             <TableHead>SKU</TableHead>
  //             <TableHead>Cantidad</TableHead>
  //             <TableHead>Costo</TableHead>
  //             <TableHead>Última Entrada</TableHead>
  //             <TableHead className="text-right">Acciones</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {products?.map((product) => (
  //             <TableRow key={product.id}>
  //               <TableCell>{product.name}</TableCell>
  //               <TableCell>{product.sku}</TableCell>
  //               <TableCell>{product.quantity}</TableCell>
  //               <TableCell>${product.cost.toFixed(2)}</TableCell>
  //               <TableCell>
  //                 {format(new Date(product.last_entry), 'PPP', { locale: es })}
  //               </TableCell>
  //               <TableCell className="text-right">
  //                 <Button
  //                   variant="ghost"
  //                   size="icon"
  //                   onClick={() => handleEdit(product)}
  //                 >
  //                   <Pencil className="h-4 w-4" />
  //                 </Button>
  //                 <Button
  //                   variant="ghost"
  //                   size="icon"
  //                   onClick={() => deleteMutation.mutate(product.id)}
  //                 >
  //                   <Trash2 className="h-4 w-4" />
  //                 </Button>
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </div>
  // );
} 