import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Loader } from "@/shared/components/ui/loader";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      addToast("warning", "Por favor completa todos los campos.");
      return;
    }


    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setAuth(data.user, data.session.access_token);
      addToast("success", "¡Bienvenido! Has iniciado sesión correctamente.");
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tus credenciales.";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card.Root className="w-full max-w-md">
      <Card.Header>
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
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
              aria-invalid={!email ? true : false}
              aria-describedby="email-error"
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
              aria-invalid={!password ? true : false}
              aria-describedby="password-error"
            />
          </div>
        </Card.Content>
        <Card.Footer className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader size="sm" className="mx-auto" /> : "Iniciar Sesión"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </Button>
          </p>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
