import type { Service } from "@/types"

export const servicesData: Service[] = [
  {
    id: 1,
    name: "Limpieza Facial Básica",
    description:
      "Tratamiento facial esencial que incluye limpieza profunda, exfoliación y extracción de impurezas para una piel fresca y radiante.",
    duration: 45,
    box: "Cualquier box",
    concurrentSessions: 1,
    imgUrl: "/images/limpieza-facial-.jpg",
    icon: "sparkles", // Added icon
    benefits: [
      "Limpieza profunda de poros",
      "Eliminación de células muertas",
      "Piel más suave y luminosa",
      "Prevención de imperfecciones",
    ],
  },
  {
    id: 2,
    name: "Limpieza Facial Premium",
    description:
      "Tratamiento facial completo con técnicas avanzadas, mascarillas especializadas y masaje facial para resultados superiores.",
    duration: 90,
    box: "Cualquier box",
    concurrentSessions: 1,
    imgUrl: "/images/limpieza-facial-.jpg",
    icon: "sparkles", // Added icon
    benefits: [
      "Limpieza profunda y detoxificación",
      "Hidratación intensiva",
      "Reducción de líneas de expresión",
      "Mejora visible de la textura",
      "Efecto rejuvenecedor",
    ],
  },
  {
    id: 3,
    name: "Limpieza Facial Superpremium",
    description:
      "Nuestro tratamiento facial más completo con tecnología de punta, mascarillas premium y técnicas especializadas para resultados excepcionales.",
    duration: 120,
    box: "Cualquier box",
    concurrentSessions: 1,
    imgUrl: "/images/limpieza-facial-.jpg",
    icon: "sparkles", // Added icon
    benefits: [
      "Tratamiento facial integral",
      "Tecnología avanzada",
      "Hidratación profunda",
      "Rejuvenecimiento visible",
      "Luminosidad duradera",
      "Efecto lifting natural",
    ],
  },
  {
    id: 4,
    name: "Masaje (30 min)",
    description:
      "Sesión de masaje terapéutico enfocada en áreas específicas para aliviar tensión y promover la relajación.",
    duration: 30,
    box: "Cualquier box",
    concurrentSessions: 3,
    imgUrl: "/images/masaje-reductivo.jpg",
    icon: "hand", // Added icon
    benefits: ["Alivio rápido de tensión", "Relajación muscular", "Mejora de la circulación", "Reducción del estrés"],
  },
  {
    id: 5,
    name: "Masaje (45 min)",
    description:
      "Masaje terapéutico completo que combina diferentes técnicas para relajación profunda y bienestar integral.",
    duration: 45,
    box: "Cualquier box",
    concurrentSessions: 3,
    imgUrl: "/images/masaje-reductivo.jpg",
    icon: "hand", // Added icon
    benefits: [
      "Relajación profunda",
      "Alivio de contracturas",
      "Mejora de la flexibilidad",
      "Equilibrio energético",
      "Bienestar general",
    ],
  },
  {
    id: 6,
    name: "Entrenamiento Funcional",
    description:
      "Sesión personalizada de ejercicios funcionales diseñados para mejorar tu fuerza, flexibilidad y condición física general.",
    duration: 60,
    box: "Solo en gym",
    concurrentSessions: 1,
    imgUrl: "/images/Entrenamiento.jpg",
    icon: "activity", // Added icon
    benefits: [
      "Mejora de la fuerza muscular",
      "Aumento de la flexibilidad",
      "Corrección postural",
      "Tonificación corporal",
      "Entrenamiento personalizado",
    ],
  },
  {
    id: 7,
    name: "Drenaje Linfático",
    description:
      "Técnica especializada de masaje suave que estimula el sistema linfático para eliminar toxinas y reducir la retención de líquidos.",
    duration: 60,
    box: "Cualquier box",
    concurrentSessions: 3,
    imgUrl: "/images/drenaje.jpg",
    icon: "leaf", // Added icon
    benefits: [
      "Reduce hinchazón y edemas",
      "Elimina toxinas",
      "Mejora la circulación",
      "Sensación de ligereza",
      "Fortalece el sistema inmune",
    ],
  },
  {
    id: 8,
    name: "Presoterapia",
    description:
      "Tratamiento con tecnología de compresión neumática que mejora la circulación, reduce celulitis y combate la retención de líquidos.",
    duration: 60,
    box: "Cualquier box",
    concurrentSessions: 1,
    imgUrl: "/images/presoterapia.jpg",
    icon: "zap", // Added icon
    benefits: [
      "Mejora la circulación sanguínea",
      "Reduce celulitis",
      "Elimina retención de líquidos",
      "Piernas más ligeras",
      "Efecto drenante",
    ],
  },
  {
    id: 9,
    name: "Lifting de Pestañas",
    description:
      "Tratamiento estético que realza y curva tus pestañas naturales, proporcionando un efecto de lifting duradero sin extensiones.",
    duration: 120,
    box: "Cualquier box",
    concurrentSessions: 1,
    imgUrl: "/images/lifting.jpg",
    icon: "sparkles", // Added icon
    benefits: [
      "Pestañas más curvadas",
      "Mirada más abierta",
      "Efecto duradero (6-8 semanas)",
      "Sin necesidad de rímel",
      "Aspecto natural",
    ],
  },
  {
    id: 10,
    name: "Radiofrecuencia Facial",
    description:
      "Tecnología avanzada que utiliza ondas electromagnéticas para estimular la producción de colágeno, reafirmar la piel y reducir arrugas.",
    duration: 45,
    box: "Solo en box 2",
    concurrentSessions: 1,
    imgUrl: "/images/radiofrecuencia.jpeg",
    icon: "zap", // Added icon
    benefits: [
      "Efecto lifting inmediato",
      "Estimula producción de colágeno",
      "Reduce arrugas y líneas",
      "Reafirma la piel",
      "Resultados progresivos",
    ],
  },
]