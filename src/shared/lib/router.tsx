import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Pages
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { Inventory } from '@/pages/dashboard/Inventory';
import { Movements } from '@/pages/dashboard/Movements';
import { Expirations } from '@/pages/dashboard/Expirations';
import { Reports } from '@/pages/dashboard/Reports';

// Stores and Layouts
import { useAuthStore } from '@/stores/authStore';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard/inventory" />;
};

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true, 
            element: <Navigate to="inventory" replace />,
          },
          {
            path: 'inventory',
            element: <Inventory />,
          },
          {
            path: 'movements',
            element: <Movements />,
          },
          {
            path: 'expirations',
            element: <Expirations />,
          },
          {
            path: 'reports',
            element: <Reports />,
          }
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard/inventory" />,
  },
]);