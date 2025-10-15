"use client"

import { useState } from "react"
import type { ContactFormData } from "@/types"

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true)

    // Simular envío de formulario
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Form submitted:", data)

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000)
  }

  return {
    isSubmitting,
    isSuccess,
    submitForm,
  }
}
