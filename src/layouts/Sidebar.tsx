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
  },
];

export function Sidebar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="w-64 bg-dark-blue text-muted flex flex-col">
      <div className="p-4 border-b border-off-white">
        <h2 className="text-xl font-bold flex items-center">Dashboard</h2>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-md ${
                isActive
                  ? "bg-purple text-white"
                  : "text-off-white hover:bg-purple-500/20"
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        <Button
          variant="outlineTransparent"
          onClick={handleLogout}
          className="mt-4 w-full justify-start"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="text-md">Cerrar Sesión</span>
        </Button>
      </nav>
    </div>
  );
}
