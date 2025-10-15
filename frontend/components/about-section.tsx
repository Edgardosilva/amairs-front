import { CheckCircle } from "lucide-react"

const benefits = [
  "Profesionales certificados y especializados",
  "Equipamiento de última generación",
  "Tratamientos personalizados",
  "Ambiente relajante y acogedor",
]

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Dedicados a tu bienestar y belleza
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En Amaris, creemos que la verdadera belleza nace del equilibrio entre cuerpo y mente. Nuestro equipo de
              kinesiólogos especializados en estética trabaja con pasión para ofrecerte tratamientos que no solo mejoran
              tu apariencia, sino que también promueven tu salud integral.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <img src="/modern-spa-wellness-center-interior.jpg" alt="Centro Amaris" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
