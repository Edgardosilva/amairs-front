"use client";

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/app/actions/auth';
import Swal from 'sweetalert2';

const Register = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await registerAction(formData);
            
            if (result.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Registro exitoso!",
                    text: "Tu cuenta ha sido creada correctamente.",
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push("/login");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error en el registro",
                    text: result.error || "Hubo un problema al crear tu cuenta.",
                });
            }
        });
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                    alt="Amaris Logo"
                    src="/images/amarisLogo.png"
                    className="mx-auto h-28 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#52a2b2]">
                    Regístrate en AMARIS
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action={handleSubmit} className="space-y-1">
                    <div>
                        <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">
                            Nombre
                        </label>
                        <div className="mt-2">
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                autoComplete="given-name"
                                disabled={isPending}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#52a2b2] sm:text-sm/6 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="apellido" className="block text-sm/6 font-medium text-gray-900">
                            Apellido
                        </label>
                        <div className="mt-2">
                            <input
                                id="apellido"
                                name="apellido"
                                type="text"
                                required
                                autoComplete="family-name"
                                disabled={isPending}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#52a2b2] sm:text-sm/6 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                disabled={isPending}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contraseña" className="block text-sm/6 font-medium text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                id="contraseña"
                                name="contraseña"
                                type="password"
                                required
                                autoComplete="new-password"
                                disabled={isPending}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-sm/6 font-medium text-gray-900">
                            Teléfono
                        </label>
                        <div className="mt-1">
                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                required
                                autoComplete="tel"
                                disabled={isPending}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex w-full justify-center rounded-md bg-[#52a2b2] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52a2b2] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Registrando..." : "Registrarse"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Ya tienes una cuenta?{' '}
                    <a href="/login" className="font-semibold text-[#a6d230] hover:text-indigo-500">
                        Inicia sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;