"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContactForm } from "@/hooks/use-contact-form"
import { Loader2, CheckCircle } from "lucide-react"

export function ContactForm() {
  const { isSubmitting, isSuccess, submitForm } = useContactForm()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    service: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitForm(formData)

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      service: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Agenda tu Consulta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Servicio de Interés</Label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
            >
              <option value="">Selecciona un servicio</option>
              <option value="facial">Tratamientos Faciales</option>
              <option value="drenaje">Drenaje Linfático</option>
              <option value="electro">Electroestética</option>
              <option value="corporal">Tratamientos Corporales</option>
              <option value="masajes">Masajes Terapéuticos</option>
              <option value="natural">Terapias Naturales</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Cuéntanos sobre tus necesidades y objetivos..."
              rows={5}
            />
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 p-4 bg-primary/10 text-primary rounded-lg">
              <CheckCircle size={20} />
              <p className="text-sm font-medium">¡Mensaje enviado con éxito! Te contactaremos pronto.</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Enviando...
              </>
            ) : (
              "Enviar Mensaje"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
