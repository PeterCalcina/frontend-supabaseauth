import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="w-full max-w-md p-8">
        <Outlet />
      </div>
    </div>
  );
} 