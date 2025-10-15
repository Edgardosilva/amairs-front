import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
            ¿Lista para comenzar tu transformación?
          </h2>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed text-pretty">
            Agenda tu primera consulta y descubre cómo podemos ayudarte a alcanzar tus objetivos de bienestar y belleza.
          </p>
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 text-base px-8"
            >
              <Link href="/contacto">Agendar Ahora</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
