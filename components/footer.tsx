import Link from "next/link"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Amaris</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Centro especializado en kinesiología estética, dedicado a tu bienestar y belleza integral.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <Phone size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <Mail size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>contacto@amaris.cl</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>Av. Principal 123, Santiago, Chile</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Amaris. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
