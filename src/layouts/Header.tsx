import { useAuthStore } from "@/stores/authStore";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <div className="text-md">
            Usuario: {user?.email}
          </div>
        </div>
      </div>
    </header>
  );
} 