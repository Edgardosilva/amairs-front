# 🎯 MEJORES PRÁCTICAS: Next.js + Zustand + Server Actions

## 📊 Comparación: React/Vite vs Next.js

### ❌ Enfoque anterior (React/Vite)
```jsx
// ❌ Fetch directo en el componente (inseguro)
const fetchAvailableTimes = async (selectedDate) => {
  const response = await fetch(
    `https://api.com/appointments/available?selectedDate=${formattedDate}`
  );
  const data = await response.json();
  setAvailableTimes(data.availableTimes || []);
};

// ❌ Props drilling
<CalendarWithTimes 
  formData={formData} 
  setFormData={setFormData} 
  isFormData={isFormData} 
  setIsFormData={setIsFormData} 
/>
```

### ✅ Enfoque actual (Next.js + Zustand)
```tsx
// ✅ Server Action (seguro, sin exponer API al cliente)
"use server"
export async function obtenerHorariosDisponibles(fecha: string) {
  const response = await fetch(`https://api.com/appointments/available?selectedDate=${fecha}`);
  return await response.json();
}

// ✅ Zustand (estado global, sin props drilling)
const formData = useFormStore((state) => state.formData);
const setAppointment = useFormStore((state) => state.setAppointment);
```

---

## 🏗️ ARQUITECTURA RECOMENDADA

### 1️⃣ **Server Actions (app/actions/)**
**Propósito:** Lógica de servidor, fetch a APIs, base de datos

```typescript
// ✅ DO: Funciones puras para Server Actions
"use server";

export async function obtenerHorariosDisponibles(fecha: string): Promise<string[]> {
  const response = await fetch(`https://api.com/...`, {
    next: { revalidate: 30 } // Cache inteligente
  });
  return response.json();
}

// ✅ DO: Helpers síncronos NO necesitan "use server"
export function calcularRangoHorarios(hora: string, duracion: number): string[] {
  // Cálculo síncrono
  return ["09:00", "09:15", "09:30"];
}
```

**❌ DON'T:**
```typescript
// ❌ No mezclar lógica de UI en Server Actions
// ❌ No usar hooks de React aquí
// ❌ No hacer "use server" en funciones que no hacen I/O
```

---

### 2️⃣ **Zustand Store (hooks/useFormStore.ts)**
**Propósito:** Estado global compartido entre páginas

```typescript
// ✅ DO: Usar selectores para mejor performance
const formData = useFormStore((state) => state.formData);
const setAppointment = useFormStore((state) => state.setAppointment);

// ❌ DON'T: Extraer todo el store (causa re-renders innecesarios)
const { formData, setAppointment, ...otherStuff } = useFormStore();
```

**Cuándo usar Zustand:**
- ✅ Datos compartidos entre múltiples páginas (formulario multi-paso)
- ✅ Datos que necesitas persistir (localStorage)
- ✅ Estado que necesita actualizarse desde varios lugares

**Cuándo NO usar Zustand:**
- ❌ Estado local de un solo componente → Usa `useState`
- ❌ Datos que vienen del servidor → Usa Server Components
- ❌ Form state simple → Usa `useFormState` o React Hook Form

---

### 3️⃣ **Client Components (app/.../page.tsx)**
**Propósito:** Interactividad, eventos, estado local

```typescript
"use client";

export default function Paso3Page() {
  // ✅ DO: Estado global con Zustand (datos del formulario)
  const formData = useFormStore((state) => state.formData);
  const setAppointment = useFormStore((state) => state.setAppointment);
  
  // ✅ DO: Estado local para UI (selección temporal)
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  
  // ✅ DO: useTransition para loading states (mejor que useState(loading))
  const [isPending, startTransition] = useTransition();
  
  // ✅ DO: Llamar Server Actions con startTransition
  useEffect(() => {
    if (selectedDate) {
      startTransition(async () => {
        const horarios = await obtenerHorariosDisponibles(fechaStr);
        setHorariosDisponibles(horarios);
      });
    }
  }, [selectedDate]);
}
```

---

## 🎯 FLUJO DE DATOS ÓPTIMO

```
┌─────────────────────────────────────────────────────┐
│ 1. USUARIO INTERACTÚA (Cliente)                     │
│    - Selecciona fecha en calendario                 │
│    - Evento onClick ejecuta handleDateSelect()      │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ 2. ESTADO LOCAL (Cliente - useState)                │
│    - setSelectedDate(date)                          │
│    - Trigger useEffect                              │
└──────────────┬──────────────────────────────────────┘
               │
               ↓ startTransition
┌─────────────────────────────────────────────────────┐
│ 3. SERVER ACTION (Servidor)                         │
│    - await obtenerHorariosDisponibles(fecha)        │
│    - Fetch a tu API de backend                      │
│    - return horarios[]                              │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ 4. ACTUALIZAR UI (Cliente)                          │
│    - setHorariosDisponibles(horarios)               │
│    - Re-render con nuevos horarios                  │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ 5. USUARIO SELECCIONA HORA                          │
│    - handleHoraSelect("09:00")                      │
│    - Calcular rango con función helper             │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ 6. GUARDAR EN ZUSTAND (Estado Global)              │
│    - setAppointment(fecha, hora, box)               │
│    - Se persiste en localStorage automáticamente    │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ 7. NAVEGAR AL SIGUIENTE PASO                        │
│    - router.push("/agendar/paso-4")                 │
│    - Datos disponibles en Paso 4 vía Zustand       │
└─────────────────────────────────────────────────────┘
```

---

## 📝 DECISIONES DE DISEÑO

### ¿Cuándo usar useState vs Zustand?

| Tipo de dato | Usar |
|--------------|------|
| Fecha seleccionada temporalmente | ✅ `useState` (local) |
| Horarios disponibles (cache temporal) | ✅ `useState` (local) |
| Rango de horarios visuales | ✅ `useState` (local) |
| **Fecha/hora final confirmada** | ✅ **Zustand** (global) |
| **Datos del usuario** | ✅ **Zustand** (global) |
| **Procedimiento seleccionado** | ✅ **Zustand** (global) |

### ¿Cuándo usar useTransition vs useState(loading)?

```typescript
// ✅ DO: useTransition (recomendado para async actions)
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  const data = await serverAction();
  setData(data);
});

// Beneficios:
// - React maneja el loading state
// - No bloquea la UI
// - Cancela requests anteriores automáticamente


// ❌ DON'T: useState(loading) - manual y propenso a errores
const [loading, setLoading] = useState(false);

setLoading(true);
const data = await serverAction();
setData(data);
setLoading(false); // ¿Y si hay error? ¿Y si el componente se desmonta?
```

---

## 🚀 OPTIMIZACIONES DE PERFORMANCE

### 1. Cache de Server Actions
```typescript
export async function obtenerHorariosDisponibles(fecha: string) {
  const response = await fetch(`https://api.com/...`, {
    next: { 
      revalidate: 30 // ✅ Cache por 30 segundos
    }
  });
}
```

### 2. Selectores de Zustand
```typescript
// ❌ BAD: Re-render en cada cambio del store
const store = useFormStore();

// ✅ GOOD: Solo re-render si formData cambia
const formData = useFormStore((state) => state.formData);

// ✅ BETTER: Selectores específicos
const procedimiento = useFormStore((state) => state.formData.procedimiento);
```

### 3. Memoización de cálculos
```typescript
// ✅ Si calcularRangoHorarios es costoso
const selectedRange = useMemo(() => {
  return calcularRangoHorarios(selectedHora, duracion);
}, [selectedHora, duracion]);
```

---

## 🔒 SEGURIDAD

### Server Actions vs Client Fetch

```typescript
// ❌ INSEGURO: Expone API key/endpoint al cliente
"use client";
const data = await fetch("https://api.com/secret?key=12345");

// ✅ SEGURO: Server Action oculta implementación
"use server";
export async function getData() {
  const data = await fetch("https://api.com/secret?key=12345");
  return data;
}
```

---

## 📦 ESTRUCTURA DE ARCHIVOS RECOMENDADA

```
app/
├── actions/
│   ├── auth.ts              # ✅ Server Actions de autenticación
│   ├── horarios.ts          # ✅ Server Actions de horarios
│   └── citas.ts             # ✅ Server Actions de citas
├── agendar/
│   ├── page.tsx             # Redirección
│   ├── paso-1/page.tsx      # ✅ Client Component
│   ├── paso-2/page.tsx      # ✅ Client Component
│   ├── paso-3/page.tsx      # ✅ Client Component
│   └── paso-4/page.tsx      # ✅ Client Component
└── layout.tsx

hooks/
└── useFormStore.ts          # ✅ Zustand store

components/
└── booking/
    ├── Stepper.tsx          # ✅ Client Component
    └── Calendario.tsx       # ✅ Client Component

types/
└── index.ts                 # ✅ TypeScript interfaces
```

---

## ✅ CHECKLIST DE MEJORES PRÁCTICAS

- [x] Server Actions con `"use server"` para fetch a APIs
- [x] Zustand solo para estado compartido entre páginas
- [x] `useState` para estado local de UI
- [x] `useTransition` en lugar de `useState(loading)`
- [x] Selectores específicos de Zustand para performance
- [x] Cache con `next: { revalidate }` en fetch
- [x] TypeScript en todo el código
- [x] Validación antes de navegar entre pasos
- [x] Persistencia automática con Zustand + localStorage
- [x] Separación de lógica (Server) y UI (Cliente)

---

## 🎓 RESUMEN

**Tu implementación actual es CORRECTA y sigue las mejores prácticas de Next.js 13+:**

1. ✅ **Server Actions** para datos del servidor
2. ✅ **Zustand** para estado global persistente
3. ✅ **useState** para estado local temporal
4. ✅ **useTransition** para loading states
5. ✅ **Separación clara** entre lógica y presentación

**Ventajas vs. tu código anterior (Vite/React):**
- 🔒 Más seguro (API keys ocultas)
- ⚡ Mejor performance (cache automático)
- 🎯 Mejor organización (separación clara)
- 💾 Persistencia automática (localStorage)
- 📱 Mejor UX (loading states integrados)
