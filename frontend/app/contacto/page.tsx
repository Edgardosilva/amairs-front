import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactoPage() {
  return (
    <main className="min-h-screen">

      {/* Hero Section */}
      <section className="pt-24 md:pt-24 pb-16 md:pb-20 bg-gradient-to-br from-background via-secondary to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">Contáctanos</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Estamos aquí para ayudarte. Agenda tu consulta o contáctanos para cualquier consulta.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Información de Contacto</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Visítanos en nuestro centro o contáctanos por los siguientes medios. Estaremos encantados de
                  atenderte.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                        <p className="text-muted-foreground text-sm">
                          Av. Principal 123, Oficina 456
                          <br />
                          Santiago, Chile
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                        <p className="text-muted-foreground text-sm">+56 9 1234 5678</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <p className="text-muted-foreground text-sm">contacto@amaris.cl</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Horario de Atención</h3>
                        <div className="text-muted-foreground text-sm space-y-1">
                          <p>Lunes a Viernes: 9:00 - 20:00</p>
                          <p>Sábados: 10:00 - 14:00</p>
                          <p>Domingos: Cerrado</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
