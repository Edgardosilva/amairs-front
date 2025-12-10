import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-accent/20">
      {/* Imagen de fondo optimizada */}
      <div className="absolute inset-0">
        <Image
          src="/spa-wellness-aesthetic-treatment.jpg"
          alt="Spa background"
          fill
          className="object-cover opacity-5"
          quality={20}
          priority={false}
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 ">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/amarisLogo.png"
              alt="Amaris - Salud, Estética & Bienestar"
              width={99}
              height={128}
              className="h-32 md:h-40 w-auto"
              priority
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
            Transforma tu bienestar con <span className="text-primary">kinesiología estética</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            En Amaris combinamos técnicas avanzadas de kinesiología con tratamientos estéticos personalizados para
            realzar tu belleza natural.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8">
              <Link href="/agendar/paso-1">
                Agendar Consulta
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 bg-transparent">
              <Link href="/servicios">Ver Servicios</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
