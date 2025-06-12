import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';

export function Expirations() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  return <div>Expirations</div>;

  // const filteredExpirations = expirations?.filter((expiration) => {
  //   const expirationDate = parseISO(expiration.expiration_date);
  //   const start = startDate ? parseISO(startDate) : null;
  //   const end = endDate ? parseISO(endDate) : null;

  //   if (start && end) {
  //     return isAfter(expirationDate, start) && isBefore(expirationDate, end);
  //   }
  //   if (start) {
  //     return isAfter(expirationDate, start);
  //   }
  //   if (end) {
  //     return isBefore(expirationDate, end);
  //   }
  //   return true;
  // });

  // if (isLoadingExpirations || isLoadingProducts) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="flex justify-between items-center">
  //         <Skeleton className="h-8 w-[200px]" />
  //         <Skeleton className="h-10 w-[200px]" />
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
  //       <h1 className="text-2xl font-bold">Vencimientos</h1>
  //       <div className="flex gap-4">
  //         <Input
  //           type="date"
  //           value={startDate}
  //           onChange={(e) => setStartDate(e.target.value)}
  //           className="w-[180px]"
  //         />
  //         <Input
  //           type="date"
  //           value={endDate}
  //           onChange={(e) => setEndDate(e.target.value)}
  //           className="w-[180px]"
  //         />
  //       </div>
  //     </div>

  //     <div className="border rounded-lg">
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>Producto</TableHead>
  //             <TableHead>Cantidad</TableHead>
  //             <TableHead>Fecha de Vencimiento</TableHead>
  //             <TableHead>Estado</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {filteredExpirations?.map((expiration) => {
  //             const product = products?.find((p) => p.id === expiration.product_id);
  //             const isExpired = isBefore(parseISO(expiration.expiration_date), new Date());
  //             const isNearExpiration = isAfter(
  //               parseISO(expiration.expiration_date),
  //               new Date()
  //             ) && isBefore(
  //               parseISO(expiration.expiration_date),
  //               new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  //             );

  //             return (
  //               <TableRow key={expiration.id}>
  //                 <TableCell>{product?.name}</TableCell>
  //                 <TableCell>{expiration.quantity}</TableCell>
  //                 <TableCell>
  //                   {format(parseISO(expiration.expiration_date), 'PPP', {
  //                     locale: es,
  //                   })}
  //                 </TableCell>
  //                 <TableCell>
  //                   {isExpired ? (
  //                     <Badge variant="destructive">Vencido</Badge>
  //                   ) : isNearExpiration ? (
  //                     <Badge variant="warning">Por Vencer</Badge>
  //                   ) : (
  //                     <Badge variant="default">Vigente</Badge>
  //                   )}
  //                 </TableCell>
  //               </TableRow>
  //             );
  //           })}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </div>
  // );
} 