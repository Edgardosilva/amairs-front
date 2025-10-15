"use client";

import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface CalendarioProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: Date[];
}

export function Calendario({ selected, onSelect, disabled = [] }: CalendarioProps) {
  // Deshabilitar domingos y fechas pasadas
  const disabledDays = [
    { dayOfWeek: [0] }, // Domingos
    { before: new Date() }, // Fechas pasadas
    ...disabled.map(date => ({ from: date, to: date }))
  ];

  return (
    <div className="calendario-custom">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={es}
        disabled={disabledDays}
        fromDate={new Date()}
        toDate={addDays(new Date(), 60)} // Hasta 60 días adelante
        className="border rounded-lg p-4 bg-white shadow-sm"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium text-[#52a2b2]",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-[#52a2b2]/10 rounded-md transition-colors"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#52a2b2]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#52a2b2]/20 rounded-md transition-colors"
          ),
          day_selected: "bg-[#52a2b2] text-white hover:bg-[#52a2b2] hover:text-white focus:bg-[#52a2b2] focus:text-white",
          day_today: "bg-[#a6d230]/20 text-[#52a2b2] font-semibold",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50 line-through",
          day_range_middle: "aria-selected:bg-[#52a2b2]/10 aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
      
      <style jsx global>{`
        .calendario-custom .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgba(82, 162, 178, 0.1);
        }
      `}</style>
    </div>
  );
}
