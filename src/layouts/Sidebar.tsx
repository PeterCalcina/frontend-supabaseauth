import { NavLink } from 'react-router-dom';
import { 
  Package, 
  ArrowLeftRight, 
  CalendarClock, 
  BarChart3, 
  User 
} from 'lucide-react';

const navigation = [
  {
    name: 'Inventarios',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    name: 'Movimientos',
    href: '/dashboard/movements',
    icon: ArrowLeftRight,
  },
  {
    name: 'Vencimientos',
    href: '/dashboard/expirations',
    icon: CalendarClock,
  },
  {
    name: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    name: 'Perfil',
    href: '/dashboard/profile',
    icon: User,
  },
];

export function Sidebar() {
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
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
} 