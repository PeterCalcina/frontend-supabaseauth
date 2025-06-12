import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Reports() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return <div>Reports</div>;

  // const { data: report, isLoading } = useQuery({
  //   queryKey: ['report', startDate, endDate],
  //   queryFn: () => reportService.getSummary(),
  // });

  // if (isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="flex justify-between items-center">
  //         <Skeleton className="h-8 w-[200px]" />
  //         <Skeleton className="h-10 w-[200px]" />
  //       </div>
  //       <div className="grid gap-4 md:grid-cols-2">
  //         <Skeleton className="h-[200px]" />
  //         <Skeleton className="h-[200px]" />
  //       </div>
  //       <Skeleton className="h-[400px]" />
  //     </div>
  //   );
  // }

  // const chartData = report
  //   ? Object.entries(report.movements_by_type).map(([type, value]) => ({
  //       name: type === 'entry' ? 'Entradas' :
  //             type === 'exit' ? 'Salidas' :
  //             type === 'expiration' ? 'Vencimientos' : 'Ventas',
  //       value,
  //     }))
  //   : [];

  // return (
  //   <div className="space-y-4">
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-bold">Reportes</h1>
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

  //     <div className="grid gap-4 md:grid-cols-2">
  //       <Card.Root>
  //         <Card.Header>
  //           <Card.Title>Total Vendido</Card.Title>
  //         </Card.Header>
  //         <Card.Content>
  //           <p className="text-3xl font-bold">
  //             ${report?.total_sold.toFixed(2)}
  //           </p>
  //         </Card.Content>
  //       </Card.Root>

  //       <Card.Root>
  //         <Card.Header>
  //           <Card.Title>Valor Actual del Inventario</Card.Title>
  //         </Card.Header>
  //         <Card.Content>
  //           <p className="text-3xl font-bold">
  //             ${report?.current_inventory_value.toFixed(2)}
  //           </p>
  //         </Card.Content>
  //       </Card.Root>
  //     </div>

  //     <Card.Root>
  //       <Card.Header>
  //         <Card.Title>Movimientos por Tipo</Card.Title>
  //       </Card.Header>
  //       <Card.Content>
  //         <div className="h-[400px]">
  //           <ResponsiveContainer width="100%" height="100%">
  //             <BarChart data={chartData}>
  //               <CartesianGrid strokeDasharray="3 3" />
  //               <XAxis dataKey="name" />
  //               <YAxis />
  //               <Tooltip />
  //               <Bar dataKey="value" fill="#8884d8" />
  //             </BarChart>
  //           </ResponsiveContainer>
  //         </div>
  //       </Card.Content>
  //     </Card.Root>
  //   </div>
  // );
}
