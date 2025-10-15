import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Eliminar la cookie de autenticación
    cookieStore.delete("access_token");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { success: false, error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
