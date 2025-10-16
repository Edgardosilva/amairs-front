import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amaris-api-production.up.railway.app';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ 
        isAuthenticated: false 
      });
    }

    // Verificar con el endpoint de tu backend
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
      return NextResponse.json({ 
        isAuthenticated: false 
      });
    }

    const data = await response.json();

    return NextResponse.json({ 
      isAuthenticated: data.authenticated || false,
      user: data.user || null
    });
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return NextResponse.json({ 
      isAuthenticated: false 
    });
  }
}
