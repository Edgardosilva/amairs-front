"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

export default function ConfirmarCitaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [mensaje, setMensaje] = useState("")
  const [citaInfo, setCitaInfo] = useState<{
    fecha?: string
    hora?: string
    procedimiento?: string
    paciente?: string
  }>({})

  useEffect(() => {
    // Obtener parámetros de la URL
    const token = searchParams.get("token")
    const citaId = searchParams.get("id")
    const success = searchParams.get("success")

    // Si viene un parámetro de success directamente
    if (success === "true") {
      setStatus("success")
      setMensaje("¡Tu cita ha sido confirmada exitosamente!")
      
      // Extraer información adicional si viene en los parámetros
      const fecha = searchParams.get("fecha")
      const hora = searchParams.get("hora")
      const procedimiento = searchParams.get("procedimiento")
      const paciente = searchParams.get("paciente")

      if (fecha || hora || procedimiento || paciente) {
        setCitaInfo({
          fecha: fecha || undefined,
          hora: hora || undefined,
          procedimiento: procedimiento || undefined,
          paciente: paciente || undefined,
        })
      }
    } else if (success === "false") {
      setStatus("error")
      setMensaje("No se pudo confirmar la cita. El enlace puede haber expirado o ya fue utilizado.")
    } else if (token || citaId) {
      // Si necesitas hacer una llamada al backend para confirmar
      // Aquí podrías hacer un fetch a tu API
      setStatus("success")
      setMensaje("¡Tu cita ha sido confirmada exitosamente!")
    } else {
      setStatus("error")
      setMensaje("Enlace de confirmación inválido.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#52a2b2]/10 to-[#a6d230]/10 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-[#52a2b2] animate-spin" />
              </div>
              <CardTitle className="text-2xl md:text-3xl">
                Confirmando tu cita...
              </CardTitle>
              <CardDescription className="text-base">
                Por favor espera un momento
              </CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl text-green-700">
                ¡Cita Confirmada!
              </CardTitle>
              <CardDescription className="text-base">
                {mensaje}
              </CardDescription>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-4">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl text-red-700">
                Error de Confirmación
              </CardTitle>
              <CardDescription className="text-base">
                {mensaje}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información de la cita */}
          {status === "success" && Object.keys(citaInfo).length > 0 && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-center mb-4">
                Detalles de tu cita
              </h3>
              
              <div className="grid gap-4">
                {citaInfo.fecha && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#52a2b2]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="font-medium">{citaInfo.fecha}</p>
                    </div>
                  </div>
                )}

                {citaInfo.hora && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#52a2b2]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hora</p>
                      <p className="font-medium">{citaInfo.hora}</p>
                    </div>
                  </div>
                )}

                {citaInfo.procedimiento && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-[#a6d230]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Procedimiento</p>
                      <p className="font-medium">{citaInfo.procedimiento}</p>
                    </div>
                  </div>
                )}

                {citaInfo.paciente && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#52a2b2]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Paciente</p>
                      <p className="font-medium">{citaInfo.paciente}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mensaje adicional para citas confirmadas */}
          {status === "success" && (
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Recibirás un recordatorio antes de tu cita.
              </p>
              <p className="text-sm text-muted-foreground">
                Si necesitas cancelar o reprogramar, por favor contáctanos.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {status === "success" && (
              <>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-[#52a2b2] hover:bg-[#52a2b2]/90"
                >
                  Ver mis citas
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Volver al inicio
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <Button
                  onClick={() => router.push("/contacto")}
                  className="flex-1 bg-[#52a2b2] hover:bg-[#52a2b2]/90"
                >
                  Contactar soporte
                </Button>
                <Button
                  onClick={() => router.push("/agendar")}
                  variant="outline"
                  className="flex-1"
                >
                  Agendar nueva cita
                </Button>
              </>
            )}
          </div>

          {/* Link adicional */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-sm text-[#52a2b2] hover:underline"
            >
              ← Volver a la página principal
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
