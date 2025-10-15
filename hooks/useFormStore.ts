import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FormData, FormStore, Procedimiento, UserAuth } from '@/types';

// Estado inicial
const initialFormData: FormData = {
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",
  procedimiento: null,
  fecha: "",
  hora: "",
  boxAsignado: "",
  idUsuarioActual: ""
};

export const useFormStore = create<FormStore>()(
  devtools(
    persist(
      (set, get) => ({
        formData: initialFormData,
        user: null,

        // Actualizar todo el formData (merge parcial)
        setFormData: (data) =>
          set(
            (state) => ({
              formData: { ...state.formData, ...data }
            }),
            false,
            'setFormData'
          ),

        // Actualizar un campo específico
        updateField: (field, value) =>
          set(
            (state) => ({
              formData: { ...state.formData, [field]: value }
            }),
            false,
            `updateField/${field}`
          ),

        // Setear el procedimiento seleccionado
        setProcedimiento: (procedimiento) =>
          set(
            (state) => ({
              formData: { ...state.formData, procedimiento }
            }),
            false,
            'setProcedimiento'
          ),

        // Setear información del usuario
        setUserInfo: (nombre, apellido, telefono, correo) =>
          set(
            (state) => ({
              formData: { ...state.formData, nombre, apellido, telefono, correo }
            }),
            false,
            'setUserInfo'
          ),

        // Setear información de la cita
        setAppointment: (fecha, hora, boxAsignado) =>
          set(
            (state) => ({
              formData: { ...state.formData, fecha, hora, boxAsignado }
            }),
            false,
            'setAppointment'
          ),

        // Setear usuario autenticado
        setUser: (user) =>
          set(
            (state) => ({
              user,
              formData: user 
                ? {
                    ...state.formData,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.email,
                    telefono: user.telefono || state.formData.telefono,
                    idUsuarioActual: user.id,
                  }
                : state.formData
            }),
            false,
            'setUser'
          ),

        // Cerrar sesión
        logout: () =>
          set(
            {
              user: null,
              formData: initialFormData
            },
            false,
            'logout'
          ),

        // Resetear el formulario
        resetForm: () =>
          set(
            { formData: initialFormData },
            false,
            'resetForm'
          ),
      }),
      {
        name: 'amaris-form-storage', // Nombre en localStorage
        partialize: (state) => ({ 
          formData: state.formData,
          user: state.user // ✅ Ahora también persiste el usuario
        }),
      }
    )
  )
);

// Selectores (opcional pero recomendado para mejor performance)
export const selectFormData = (state: FormStore) => state.formData;
export const selectUser = (state: FormStore) => state.user;
export const selectIsAuthenticated = (state: FormStore) => state.user?.isAuthenticated || false;
export const selectProcedimiento = (state: FormStore) => state.formData.procedimiento;
export const selectUserInfo = (state: FormStore) => ({
  nombre: state.formData.nombre,
  apellido: state.formData.apellido,
  telefono: state.formData.telefono,
  correo: state.formData.correo,
});
export const selectAppointment = (state: FormStore) => ({
  fecha: state.formData.fecha,
  hora: state.formData.hora,
  boxAsignado: state.formData.boxAsignado,
});
