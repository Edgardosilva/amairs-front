"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amaris-api-production.up.railway.app';

interface VerificarAuthResponse {
  isAuthenticated: boolean;
  userId?: string;
}

export async function verificarAuth(): Promise<VerificarAuthResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { isAuthenticated: false };
    }

    // Verificar el token con el backend usando tu endpoint existente
    const response = await fetch(
      `${API_URL}/login/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${token}`,
        },
      }
    );

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    const data = await response.json();
    
    // El endpoint devuelve { authenticated: boolean, user: {...} }
    return {
      isAuthenticated: data.authenticated || false,
      userId: data.user?.id,
    };
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return { isAuthenticated: false };
  }
}

export async function obtenerUsuarioActual(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return null;
    }

    // Obtener usuario actual usando tu endpoint existente
    const response = await fetch(
      `${API_URL}/login/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // El endpoint devuelve { authenticated: boolean, user: {...} }
    if (data.authenticated && data.user) {
      return data.user.id;
    }
    
    return null;
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
}
