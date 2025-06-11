import { Outlet } from 'react-router-dom';
import { Header } from '@/layouts/Header';
import { Sidebar } from '@/layouts/Sidebar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 