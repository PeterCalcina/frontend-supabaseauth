import { useState } from "react";
import { Card, Button } from "@/shared/components/ui";
import { CurrentStockReport, MovementHistoryReport, ExpiringStockReport } from "./components";

type ReportTab = "current-stock" | "movement-history" | "expiring-stock";

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>("current-stock");

  const tabs: { id: ReportTab; label: string }[] = [
    { id: "current-stock", label: "Stock Actual" },
    { id: "movement-history", label: "Historial de Movimientos" },
    { id: "expiring-stock", label: "Stock por Vencer" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reportes</h1>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card.Root>
        <Card.Content className="p-0">
          {activeTab === "current-stock" && <CurrentStockReport />}
          {activeTab === "movement-history" && <MovementHistoryReport />}
          {activeTab === "expiring-stock" && <ExpiringStockReport />}
        </Card.Content>
      </Card.Root>
    </div>
  );
}
