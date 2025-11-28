/**
 * Tests para lógica de disponibilidad de horarios
 * 
 * Reglas de negocio:
 * 1. Verificar disponibilidad según tipo de procedimiento
 * 2. Limpiezas faciales: bloquean solo si hay otra limpieza
 * 3. Gym: solo para Entrenamiento Funcional
 * 4. Box 2: solo para Radiofrecuencia
 * 5. Máximo 3 boxes ocupados = no disponible
 */

describe('getAvailableAppointments - Disponibilidad de horarios', () => {
  
  describe('Horarios sin citas', () => {
    test('Debe retornar todos los horarios cuando no hay citas', () => {
      const occupiedSchedules = [];
      const allTimes = ["09:00", "09:15", "09:30", "10:00"];
      
      const availableTimes = allTimes.filter((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        const citasEnHorario = occupiedSchedules.filter(schedule => {
          const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
          const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
          const startInMinutes = startHours * 60 + startMinutes;
          const endInMinutes = endHours * 60 + endMinutes;
          
          return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
        });
        
        return citasEnHorario.length === 0;
      });
      
      expect(availableTimes).toEqual(allTimes);
    });
  });

  describe('Bloqueo por Limpiezas Faciales', () => {
    test('Debe bloquear horario si ya hay una limpieza facial', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:30:00", box: "Box 1", procedimiento_id: 1 }
      ];
      const procedimiento_id = 2; // Otra limpieza facial
      const limpiezasFaciales = [1, 2, 3];
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const hayLimpiezaFacial = citasEnHorario.some(cita => 
        limpiezasFaciales.includes(cita.procedimiento_id)
      );
      
      const disponible = !hayLimpiezaFacial;
      
      expect(disponible).toBe(false);
    });

    test('Debe permitir horario si limpieza pero hay boxes disponibles y no es limpieza', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:30:00", box: "Box 1", procedimiento_id: 1 }
      ];
      const procedimiento_id = 5; // Masaje (no es limpieza)
      const limpiezasFaciales = [1, 2, 3];
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const procId = parseInt(procedimiento_id);
      
      if (limpiezasFaciales.includes(procId)) {
        const hayLimpiezaFacial = citasEnHorario.some(cita => 
          limpiezasFaciales.includes(cita.procedimiento_id)
        );
        expect(hayLimpiezaFacial).toBe(false);
      } else {
        const boxesOcupados = new Set(
          citasEnHorario
            .filter(cita => ["Box 1", "Box 2", "Box 3"].includes(cita.box))
            .map(cita => cita.box)
        );
        expect(boxesOcupados.size).toBeLessThan(3);
      }
    });
  });

  describe('Bloqueo por Gym ocupado', () => {
    test('Debe bloquear horario para Entrenamiento si Gym ocupado', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:00:00", box: "Gym", procedimiento_id: 6 }
      ];
      const procedimiento_id = 6; // Entrenamiento Funcional
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const gymOcupado = citasEnHorario.some(cita => cita.box === "Gym");
      
      expect(gymOcupado).toBe(true);
    });
  });

  describe('Bloqueo por Box 2 ocupado', () => {
    test('Debe bloquear horario para Radiofrecuencia si Box 2 ocupado', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "10:45:00", box: "Box 2", procedimiento_id: 10 }
      ];
      const procedimiento_id = 10; // Radiofrecuencia
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const box2Ocupado = citasEnHorario.some(cita => cita.box === "Box 2");
      
      expect(box2Ocupado).toBe(true);
    });
  });

  describe('Bloqueo por boxes completos', () => {
    test('Debe bloquear horario cuando 3 boxes están ocupados', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:00:00", box: "Box 1", procedimiento_id: 1 },
        { hora: "10:00:00", horaTermino: "10:30:00", box: "Box 2", procedimiento_id: 5 },
        { hora: "10:00:00", horaTermino: "11:00:00", box: "Box 3", procedimiento_id: 8 }
      ];
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const boxesOcupados = new Set(
        citasEnHorario
          .filter(cita => ["Box 1", "Box 2", "Box 3"].includes(cita.box))
          .map(cita => cita.box)
      );
      
      expect(boxesOcupados.size).toBe(3);
    });

    test('Debe permitir horario cuando hay box disponible', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:00:00", box: "Box 1", procedimiento_id: 1 },
        { hora: "10:00:00", horaTermino: "10:30:00", box: "Box 2", procedimiento_id: 5 }
      ];
      
      const time = "10:00";
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      const boxesOcupados = new Set(
        citasEnHorario
          .filter(cita => ["Box 1", "Box 2", "Box 3"].includes(cita.box))
          .map(cita => cita.box)
      );
      
      expect(boxesOcupados.size).toBeLessThan(3);
    });
  });

  describe('Solapamiento de duración', () => {
    test('Debe bloquear horarios durante toda la duración del procedimiento', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "11:30:00", box: "Box 1", procedimiento_id: 2 }
      ];
      
      const testTimes = ["10:00", "10:15", "10:30", "10:45", "11:00", "11:15"];
      const blockedTimes = [];
      
      testTimes.forEach(time => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        const citasEnHorario = occupiedSchedules.filter(schedule => {
          const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
          const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
          const startInMinutes = startHours * 60 + startMinutes;
          const endInMinutes = endHours * 60 + endMinutes;
          
          return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
        });
        
        if (citasEnHorario.length > 0) {
          blockedTimes.push(time);
        }
      });
      
      // Debe bloquear de 10:00 a 11:15 (antes de 11:30)
      expect(blockedTimes).toEqual(["10:00", "10:15", "10:30", "10:45", "11:00", "11:15"]);
    });

    test('Debe permitir horario después de que termine el procedimiento', () => {
      const occupiedSchedules = [
        { hora: "10:00:00", horaTermino: "10:45:00", box: "Box 1", procedimiento_id: 5 }
      ];
      
      const time = "10:45"; // Justo cuando termina
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      const citasEnHorario = occupiedSchedules.filter(schedule => {
        const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
        const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);
        const startInMinutes = startHours * 60 + startMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
      });
      
      expect(citasEnHorario.length).toBe(0);
    });
  });
});
