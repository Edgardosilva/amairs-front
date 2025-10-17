"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, LogOut, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Cita {
  id: number;
  title: string;
  start: string;
  state: string;
  procedimiento?: string;
  paciente?: string;
  solicitante?: string;
  fecha?: string;
  hora?: string;
  horaTermino?: string;
  box?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmadas: 0,
    pendientes: 0,
    canceladas: 0
  });

  useEffect(() => {
    // Esperar a que el store se hidrate desde localStorage
    if (!_hasHydrated) {
      console.log('⏳ Esperando hidratación del store...');
      return;
    }

    console.log('👤 Estado de auth en admin:', { isAuthenticated, isAdmin, user });
    
    // Verificar autenticación después de hidratar
    if (!isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a login');
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      console.log('❌ No es admin, redirigiendo a dashboard');
      router.push("/dashboard");
      return;
    }

    console.log('✅ Usuario admin autenticado, cargando citas');
    // Si está autenticado y es admin, cargar las citas
    fetchAllAppointments();
  }, [_hasHydrated, isAuthenticated, isAdmin, router, user]);

  const fetchAllAppointments = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/appointments/getAllAppointments`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCitas(data);
        
        // Calcular estadísticas
        const stats = {
          total: data.length,
          confirmadas: data.filter((c: Cita) => c.state === "Confirmada").length,
          pendientes: data.filter((c: Cita) => c.state === "Pendiente").length,
          canceladas: data.filter((c: Cita) => c.state === "Cancelada").length
        };
        setStats(stats);
      } else if (response.status === 403) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case "Confirmada":
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case "Pendiente":
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case "Cancelada":
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge>{state}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Mostrar loading mientras hidrata o carga datos
  if (!_hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent/20 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenido, {user?.nombre} {user?.apellido}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.confirmadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pendientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.canceladas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Todas las Citas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            {citas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay citas agendadas
              </p>
            ) : (
              <div className="space-y-4">
                {citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{cita.title}</h3>
                        {getStateBadge(cita.state)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {cita.start && formatDate(cita.start)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(cita.start).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Box: {cita.box ? cita.box : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
