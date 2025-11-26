"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/hooks/useFormStore";
import { Stepper } from "@/components/booking/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = [
  { number: 1, title: "Datos Personales", description: "Tu información" },
  { number: 2, title: "Servicio", description: "Elige tu tratamiento" },
  { number: 3, title: "Fecha y Hora", description: "Agenda tu cita" },
  { number: 4, title: "Confirmación", description: "Revisa y confirma" },
];

export default function Paso1Page() {
  const router = useRouter();
  const { formData, setUserInfo } = useFormStore();
  
  const [nombre, setNombre] = useState(formData.nombre);
  const [apellido, setApellido] = useState(formData.apellido);
  const [telefono, setTelefono] = useState(formData.telefono);
  const [correo, setCorreo] = useState(formData.correo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\+56\d{9}$/.test(telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "Formato: +56973846573 (código país + 9 dígitos)";
    }
    if (!correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Ingresa un correo válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinuar = () => {
    if (validateForm()) {
      // Guardar en el store
      setUserInfo(nombre, apellido, telefono, correo);
      // Navegar al siguiente paso
      router.push("/agendar/paso-2");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stepper */}
        <Stepper currentStep={1} steps={steps} />

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#a6d230] mb-2">
              Bienvenido a Amaris
            </h1>
            <p className="text-xl text-[#52a2b2] font-medium">
              ¡Agenda Tu Hora!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 font-medium">
                Nombre del paciente
              </Label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-gray-700 font-medium">
                Apellido
              </Label>
              <Input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ingresa tu apellido"
                className={errors.apellido ? "border-red-500" : ""}
              />
              {errors.apellido && (
                <p className="text-sm text-red-500">{errors.apellido}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-gray-700 font-medium">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo" className="text-gray-700 font-medium">
                Correo
              </Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@email.com"
                className={errors.correo ? "border-red-500" : ""}
              />
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo}</p>
              )}
            </div>
          </div>

          {/* Botón continuar */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleContinuar}
              size="lg"
              className="bg-[#52a2b2] hover:bg-[#458a98] text-white px-8"
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
