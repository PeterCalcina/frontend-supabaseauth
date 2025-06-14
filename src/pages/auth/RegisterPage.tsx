import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabase'
import { useToastStore } from '@/stores/toastStore'
import { Button, Input, Card, Loader } from '@/shared/components/ui'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      addToast('error', 'Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      addToast('success', '¡Cuenta creada exitosamente! Por favor, verifica tu email.')
      navigate('/login')
    } catch (error) {
      addToast('error', 'Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <Card.Root className="w-full max-w-md bg-white">
        <Card.Header>
          <h2 className="text-2xl font-bold text-center text-dark-blue">Crear Cuenta</h2>
        </Card.Header>
        <form onSubmit={handleSubmit}>
          <Card.Content className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Loader size="sm" message="Creando cuenta..." /> : 'Crear Cuenta'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={() => navigate('/login')}
              >
                Inicia sesión
              </Button>
            </p>
          </Card.Footer>
        </form>
      </Card.Root>
  )
} 