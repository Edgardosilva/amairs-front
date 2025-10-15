"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const response = await fetch(
      "https://amaris-api-production.up.railway.app/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          contraseña: password,
        }),
      }
    );
    
    if (!response.ok) {
      return { 
        success: false, 
        error: "Correo o contraseña incorrectos" 
      };
    }
    
    const data = await response.json();
    
    // El backend envía el token como cookie en el Set-Cookie header
    const setCookieHeader = response.headers.get("set-cookie");
    
    // Extraer el token de la cookie
    let token = null;
    if (setCookieHeader) {
      const match = setCookieHeader.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
    
    // Fallback: intentar obtener del body JSON
    if (!token) {
      token = data.token || data.access_token || data.accessToken;
    }
    
    if (!token) {
      return {
        success: false,
        error: "Error al obtener el token de autenticación"
      };
    }
    
    // Guardar token en cookies de Next.js
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });
    
    // Preparar información del usuario
    const userInfo = {
      id: data.user?.id || data.id || "",
      nombre: data.user?.nombre || data.nombre || "",
      apellido: data.user?.apellido || data.apellido || "",
      email: data.user?.email || data.email || email,
      telefono: data.user?.telefono || data.telefono || "",
    };
    
    return { 
      success: true,
      user: userInfo
    };
  } catch (error) {
    console.error("Error al hacer login:", error);
    return { 
      success: false, 
      error: "Hubo un problema con el servidor" 
    };
  }
}

export async function registerAction(formData: FormData) {

  const nombre = formData.get("nombre") as string;
  const apellido = formData.get("apellido") as string;
  const email = formData.get("email") as string;
  const contraseña = formData.get("contraseña") as string;
  const telefono = formData.get("telefono") as string;

  try {
    const response = await fetch(
      "https://amaris-api-production.up.railway.app/login/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contraseña,
          telefono,
        }),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Hubo un problema al crear tu cuenta.",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error al registrar:", error);
    return {
      success: false,
      error: "No se pudo conectar con el servidor. Intenta nuevamente.",
    };
  }
}
