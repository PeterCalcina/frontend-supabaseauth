import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const handleLogout = () => {
    logout();
    addToast('success', '¡Hasta pronto! Has cerrado sesión correctamente.');
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>Información del Usuario</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID de Usuario</h3>
              <p className="text-lg">{user?.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Último Acceso
              </h3>
              <p className="text-lg">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'No disponible'}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
} 