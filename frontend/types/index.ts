export interface Service {
  id: number
  name: string
  description: string
  duration: number
  box: string
  concurrentSessions: number
  imgUrl: string
  benefits: string[]
  icon: string // Added icon property
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  service?: string
}

export interface NavLink {
  href: string
  label: string
}

// Tipos para el sistema de agendamiento
export interface Procedimiento {
  id?: string
  nombre?: string
  precio?: number
  duracion?: number
  descripcion?: string
  box?: string
  concurrentSessions?: number
}

export interface FormData {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  procedimiento: Procedimiento | null
  fecha: string
  hora: string
  boxAsignado: string
  idUsuarioActual: string
}

export interface UserAuth {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  isAuthenticated: boolean
}

export interface FormStore {
  formData: FormData
  user: UserAuth | null
  // Acciones
  setFormData: (data: Partial<FormData>) => void
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  setProcedimiento: (procedimiento: Procedimiento) => void
  setUserInfo: (nombre: string, apellido: string, telefono: string, correo: string) => void
  setAppointment: (fecha: string, hora: string, boxAsignado: string) => void
  setUser: (user: UserAuth | null) => void
  logout: () => void
  resetForm: () => void
}
