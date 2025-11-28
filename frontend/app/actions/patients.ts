"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amaris-api-production.up.railway.app';

interface Patient {
  nombre_paciente: string;
  total_citas: number;
  ultima_atencion: string;
  ultimo_procedimiento: string;
  emails_registrados: string;
  telefonos_registrados: string;
}

interface PatientHistory {
  id: number;
  fecha: string;
  hora: string;
  horaTermino: string;
  duracion: number;
  box: string;
  estado: string;
  procedimiento: string;
}

interface PatientData {
  nombre: string;
  solicitantes: Array<{
    nombre: string;
    email: string;
    telefono: string;
  }>;
}

interface PatientStats {
  total_citas: number;
  procedimientos_realizados: number;
  ultima_visita: string | null;
}

export async function searchPatients(query: string = ""): Promise<{ success: boolean; patients?: Patient[]; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const searchParam = query.trim() !== '' ? `?query=${encodeURIComponent(query)}` : '';
    const response = await fetch(`${API_URL}/patients/search${searchParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${token.value}`
      },
      credentials: "include",
      cache: "no-store"
    });

    if (!response.ok) {
      return { success: false, error: "Error al buscar pacientes" };
    }

    const data = await response.json();
    return { success: true, patients: data.patients };
  } catch (error) {
    console.error("Error en searchPatients:", error);
    return { success: false, error: "Error al buscar pacientes" };
  }
}

export async function getPatientHistory(pacienteNombre: string): Promise<{ 
  success: boolean; 
  patient?: PatientData;
  history?: PatientHistory[];
  stats?: PatientStats;
  error?: string 
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/patients/${encodeURIComponent(pacienteNombre)}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${token.value}`
      },
      credentials: "include",
      cache: "no-store"
    });

    if (!response.ok) {
      return { success: false, error: "Error al obtener historial" };
    }

    const data = await response.json();
    return { 
      success: true, 
      patient: data.patient,
      history: data.history,
      stats: data.stats
    };
  } catch (error) {
    console.error("Error en getPatientHistory:", error);
    return { success: false, error: "Error al obtener historial" };
  }
}
