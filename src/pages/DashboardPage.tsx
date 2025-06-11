import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { addToast } = useToastStore()

  const handleLogout = () => {
    logout()
    addToast('success', '¡Hasta pronto! Has cerrado sesión correctamente.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Información del Usuario</h2>
                <p className="text-gray-600">
                  Email: <span className="font-medium">{user?.email}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 