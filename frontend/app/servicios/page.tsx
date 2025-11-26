import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Heart, Zap, Activity, Hand, Leaf, CheckCircle, Clock, MapPin, Users } from "lucide-react"
import { servicesData } from "@/services/data"
import Image from "next/image"

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  zap: Zap,
  activity: Activity,
  hand: Hand,
  leaf: Leaf,
}

export default function ServiciosPage() {
  return (
    <main className="min-h-screen">

      {/* Hero Section */}
      <section className="pt-24 md:pt-24 pb-16 md:pb-20 bg-gradient-to-br from-background via-secondary to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Nuestros Servicios
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Descubre nuestra completa gama de tratamientos de kinesiología estética, diseñados para realzar tu belleza
              natural y promover tu bienestar integral.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap]
              return (
                <Card
                  key={service.id}
                  className="border-border hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden"
                >
                  <div className="relative h-48 w-full bg-secondary">
                    <Image
                      src={service.imgUrl || "/placeholder.svg"}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="text-primary" size={28} />
                    </div>
                    <CardTitle className="text-2xl text-foreground">{service.name}</CardTitle>
                    <div className="flex flex-wrap gap-3 pt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-primary" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-primary" />
                        <span>{service.box}</span>
                      </div>
                      {service.concurrentSessions > 1 && (
                        <div className="flex items-center gap-1.5">
                          <Users size={16} className="text-primary" />
                          <span>Hasta {service.concurrentSessions} personas</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    <div className="space-y-2 pt-2">
                      <p className="font-semibold text-foreground text-sm">Beneficios:</p>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              ¿Interesada en algún tratamiento?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Contáctanos para una consulta personalizada y descubre cuál es el mejor tratamiento para ti.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/agendar/paso-1">Agendar Consulta</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  )
}
