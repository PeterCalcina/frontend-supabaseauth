import { Outlet } from 'react-router-dom';
import { Header } from '@/layouts/Header';
import { Sidebar } from '@/layouts/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-off-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-offwhite">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 