import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServicesPreview } from "@/components/services-preview"
import { AboutSection } from "@/components/about-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">

      <HeroSection />
      <ServicesPreview />
      <AboutSection />
      <CTASection />
  
    </main>
  )
}
