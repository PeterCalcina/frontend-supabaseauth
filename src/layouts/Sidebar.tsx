import { NavLink, useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeftRight,
  CalendarClock,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/shared/components/ui/button";

const navigation = [
  {
    name: "Inventarios",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Movimientos",
    href: "/dashboard/movements",
    icon: ArrowLeftRight,
  },
  {
    name: "Vencimientos",
    href: "/dashboard/expirations",
    icon: CalendarClock,
  },
  {
    name: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  }
];

export function Sidebar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="w-64 border-r bg-background">
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        <Button variant="outline" onClick={handleLogout} className="mt-4">
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </nav>
    </div>
  );
}
