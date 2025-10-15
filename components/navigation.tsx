"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFormStore, selectUser, selectIsAuthenticated } from "@/hooks/useFormStore"
import { useRouter } from "next/navigation"
import type { NavLink } from "@/types"
import Image from "next/image"

const navLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
]

const authenticatedLinks: NavLink[] = [
  { href: "/dashboard", label: "Mis Citas" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useFormStore(selectUser)
  const isAuthenticated = useFormStore(selectIsAuthenticated)
  const { logout } = useFormStore()
  const router = useRouter()

  const handleLogout = async () => {
    logout()
    
    // Limpiar la cookie del servidor
    await fetch("/api/logout", { method: "POST" })
    
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/amarisLogo.png"
              alt="Amaris - Salud, Estética & Bienestar"
              width={120}
              height={60}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && authenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-primary" />
                  <span className="text-foreground">{user?.nombre}</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="lg"
                  className="gap-2"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && authenticatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2 text-sm border-t border-border mt-2 pt-4">
                    <User size={16} className="text-primary" />
                    <span className="text-foreground font-medium">{user?.nombre}</span>
                  </div>
                  <Button 
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }} 
                    variant="outline" 
                    className="w-full gap-2"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}