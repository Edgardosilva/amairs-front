import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart, Zap, Leaf } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Sparkles,
    title: "Tratamientos Faciales",
    description: "Rejuvenecimiento y cuidado facial con técnicas especializadas para una piel radiante.",
  },
  {
    icon: Heart,
    title: "Drenaje Linfático",
    description: "Reduce la retención de líquidos y mejora la circulación para un bienestar integral.",
  },
  {
    icon: Zap,
    title: "Electroestética",
    description: "Tecnología avanzada para modelar y tonificar tu cuerpo de forma no invasiva.",
  },
  {
    icon: Leaf,
    title: "Terapias Naturales",
    description: "Tratamientos holísticos que combinan lo mejor de la naturaleza y la ciencia.",
  },
]

export function ServicesPreview() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Descubre nuestra amplia gama de tratamientos diseñados para realzar tu belleza y bienestar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
            <Link href="/servicios">Ver Todos los Servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
