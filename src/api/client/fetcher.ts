// src/hooks/useAuthFetcher.ts
import { useAuthStore } from "@/stores/authStore";
import { Response } from "@/shared/types/response";

export const useAuthFetcher = () => {
  const fetcher = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<Response<T>> => {
    const currentToken = useAuthStore.getState().token;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorResponse: Response<any> | null = await res
        .json()
        .catch(() => null);

      let errorMessage = "Error desconocido al obtener los datos.";

      if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      } else if (typeof errorResponse?.error === "string") {
        errorMessage = errorResponse.error;
      } else if (res.statusText) {
        errorMessage = res.statusText;
      }

      if (res.status === 401) {
        useAuthStore.getState().logout();
        errorMessage =
          errorResponse?.message || "Sesión expirada, inicia sesión otra vez.";
      }

      throw new Error(errorMessage);
    }

    const jsonResponse: Response<T> = await res.json();

    if (jsonResponse.data === undefined && res.status !== 204) {
      throw new Error("La respuesta exitosa no contiene datos esperados.");
    }

    return jsonResponse;
  };

  return fetcher;
};
