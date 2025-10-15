"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-8 ">
      {/* Barra de progreso móvil */}
      <div className="mb-6 md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Paso {currentStep} de {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#52a2b2] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stepper visual - Desktop */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Círculo del paso */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-200",
                    currentStep > step.number
                      ? "bg-[#52a2b2] text-white"
                      : currentStep === step.number
                      ? "bg-[#52a2b2] text-white ring-4 ring-[#52a2b2]/20"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number
                        ? "text-[#52a2b2]"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 -mt-12">
                  <div
                    className={cn(
                      "h-full rounded transition-all duration-300",
                      currentStep > step.number
                        ? "bg-[#52a2b2]"
                        : "bg-gray-200"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
