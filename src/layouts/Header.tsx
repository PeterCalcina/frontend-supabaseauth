import { useAuthStore } from "@/stores/authStore";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {user?.email}
          </div>
        </div>
      </div>
    </header>
  );
} 