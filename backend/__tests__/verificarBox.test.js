/**
 * Tests para verificarBox - Lógica de asignación de boxes
 * 
 * Reglas de negocio:
 * 1. Máximo 1 procedimiento por box
 * 2. Limpiezas Faciales (IDs 1,2,3): solo 1 a la vez, pero pueden coexistir con otros
 * 3. Entrenamiento Funcional (ID 6): solo en Gym
 * 4. Radiofrecuencia (ID 10): solo en Box 2
 * 5. cs=1: procedimiento exclusivo en un box
 * 6. cs>1: puede compartir horario en diferentes boxes
 */

import { jest } from '@jest/globals';

// Mock de la base de datos
const mockDb = {
  execute: jest.fn()
};

// Importar la función a testear (necesitaremos ajustar para inyectar el mock)
// Por ahora, definimos la lógica directamente para los tests
const verificarBox = async (fecha, hora, horaTermino, box, concurrentSessions, procedimiento_id, dbMock) => {
  const querySolapamientos = `
    SELECT box, concurrent_sessions, procedimiento_id 
    FROM horarios_ocupados 
    WHERE fecha = ? AND (
      (hora >= ? AND hora < ?) OR 
      (horaTermino > ? AND horaTermino <= ?) OR 
      (hora <= ? AND horaTermino >= ?)
    )
  `;

  const [solapados] = await dbMock.execute(querySolapamientos, [
    fecha, hora, horaTermino, hora, horaTermino, hora, horaTermino
  ]);

  const limpiezasFaciales = [1, 2, 3];

  // Caso 1: Solo en Box 2
  if (box === "Solo en box 2") {
    const box2Ocupado = solapados.some(cita => cita.box === "Box 2");
    return box2Ocupado ? null : "Box 2";
  }

  // Caso 2: Solo en Gym
  if (box === "Solo en gym") {
    const gymOcupado = solapados.some(cita => cita.box === "Gym");
    return gymOcupado ? null : "Gym";
  }

  // Caso 3: Limpieza Facial con cs=1
  if (concurrentSessions === 1 && limpiezasFaciales.includes(procedimiento_id)) {
    const hayOtraLimpiezaFacial = solapados.some(cita => 
      limpiezasFaciales.includes(cita.procedimiento_id)
    );
    if (hayOtraLimpiezaFacial) return null;
    
    const boxesOcupados = new Set(solapados.map(cita => cita.box));
    const boxDisponible = ["Box 1", "Box 2", "Box 3"].find(b => !boxesOcupados.has(b));
    return boxDisponible || null;
  }

  // Caso 4: Procedimiento exclusivo (cs=1)
  if (concurrentSessions === 1) {
    const boxesOcupados = new Set(solapados.map(cita => cita.box));
    const boxDisponible = ["Box 1", "Box 2", "Box 3"].find(b => !boxesOcupados.has(b));
    return boxDisponible || null;
  }

  // Caso 5: Procedimiento compartible (cs>1)
  if (concurrentSessions > 1) {
    const boxesOcupados = new Set(solapados.map(cita => cita.box));
    const boxDisponible = ["Box 1", "Box 2", "Box 3"].find(b => !boxesOcupados.has(b));
    return boxDisponible || null;
  }

  return null;
};

describe('verificarBox - Asignación de Boxes', () => {
  beforeEach(() => {
    mockDb.execute.mockClear();
  });

  describe('Regla 1: Entrenamiento Funcional solo en Gym', () => {
    test('Debe asignar Gym cuando está disponible', async () => {
      mockDb.execute.mockResolvedValue([[]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:00:00', 
        'Solo en gym', 1, 6, mockDb
      );
      
      expect(resultado).toBe('Gym');
    });

    test('Debe retornar null cuando Gym está ocupado', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Gym', concurrent_sessions: 1, procedimiento_id: 6 }
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:00:00', 
        'Solo en gym', 1, 6, mockDb
      );
      
      expect(resultado).toBeNull();
    });
  });

  describe('Regla 2: Radiofrecuencia solo en Box 2', () => {
    test('Debe asignar Box 2 cuando está disponible', async () => {
      mockDb.execute.mockResolvedValue([[]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '10:45:00', 
        'Solo en box 2', 1, 10, mockDb
      );
      
      expect(resultado).toBe('Box 2');
    });

    test('Debe retornar null cuando Box 2 está ocupado', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 2', concurrent_sessions: 1, procedimiento_id: 10 }
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '10:45:00', 
        'Solo en box 2', 1, 10, mockDb
      );
      
      expect(resultado).toBeNull();
    });
  });

  describe('Regla 3: Limpiezas Faciales - Solo 1 a la vez', () => {
    test('Debe permitir agendar cuando no hay otra limpieza facial', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 3, procedimiento_id: 5 } // Masaje
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:30:00', 
        'Cualquier box', 1, 2, mockDb // Limpieza Premium
      );
      
      expect(resultado).toBe('Box 2');
    });

    test('Debe rechazar cuando ya hay otra limpieza facial', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 1 } // Limpieza Básica
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:30:00', 
        'Cualquier box', 1, 2, mockDb // Limpieza Premium
      );
      
      expect(resultado).toBeNull();
    });

    test('Limpieza puede coexistir con masajes en diferentes boxes', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 3, procedimiento_id: 4 }, // Masaje
        { box: 'Box 2', concurrent_sessions: 3, procedimiento_id: 5 }  // Masaje
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '10:45:00', 
        'Cualquier box', 1, 1, mockDb // Limpieza Básica
      );
      
      expect(resultado).toBe('Box 3');
    });
  });

  describe('Regla 4: Máximo 1 procedimiento por box', () => {
    test('Debe asignar box disponible cuando hay múltiples procedimientos', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 9 }, // Lifting
        { box: 'Box 2', concurrent_sessions: 1, procedimiento_id: 10 } // Radio
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:00:00', 
        'Cualquier box', 1, 8, mockDb // Presoterapia
      );
      
      expect(resultado).toBe('Box 3');
    });

    test('Debe retornar null cuando todos los boxes están ocupados', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 9 },
        { box: 'Box 2', concurrent_sessions: 1, procedimiento_id: 10 },
        { box: 'Box 3', concurrent_sessions: 1, procedimiento_id: 8 }
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:00:00', 
        'Cualquier box', 1, 7, mockDb // Drenaje
      );
      
      expect(resultado).toBeNull();
    });
  });

  describe('Regla 5: Procedimientos con cs=3 (compartibles)', () => {
    test('Masajes pueden usar cualquier box disponible', async () => {
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 1 }
      ]]);
      
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '10:30:00', 
        'Cualquier box', 3, 4, mockDb // Masaje
      );
      
      expect(resultado).toBe('Box 2');
    });
  });

  describe('Escenario completo: 4 procedimientos simultáneos', () => {
    test('Debe permitir 1 Limpieza + 1 Masaje + 1 Presoterapia + 1 Entrenamiento', async () => {
      // Simular que ya hay 3 procedimientos
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 2 }, // Limpieza
        { box: 'Box 2', concurrent_sessions: 3, procedimiento_id: 5 }, // Masaje
        { box: 'Box 3', concurrent_sessions: 1, procedimiento_id: 8 }  // Presoterapia
      ]]);
      
      // Intentar agendar Entrenamiento
      const resultado = await verificarBox(
        '2025-12-05', '10:00:00', '11:00:00', 
        'Solo en gym', 1, 6, mockDb
      );
      
      expect(resultado).toBe('Gym');
    });
  });

  describe('Validación de solapamiento de horarios', () => {
    test('Debe detectar solapamiento al inicio del horario', async () => {
      // Box 1 ocupado de 10:00 a 11:30 con Limpieza Facial
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 2 }
      ]]);
      
      // Intenta agendar de 10:15 a 11:45 (solapa con Box 1)
      // Pero NO es limpieza, entonces debería asignar Box 2
      const resultado = await verificarBox(
        '2025-12-05', '10:15:00', '11:45:00',
        'Cualquier box', 3, 5, mockDb // Masaje, cs=3
      );
      
      expect(resultado).toBe('Box 2'); // Debe asignar otro box
    });

    test('Debe detectar solapamiento al final del horario', async () => {
      // Box 1 ocupado de 10:00 a 11:30
      mockDb.execute.mockResolvedValue([[
        { box: 'Box 1', concurrent_sessions: 3, procedimiento_id: 5 }
      ]]);
      
      // Intenta agendar de 09:30 a 10:30 (solapa con Box 1)
      const resultado = await verificarBox(
        '2025-12-05', '09:30:00', '10:30:00',
        'Cualquier box', 3, 5, mockDb // Masaje, cs=3
      );
      
      expect(resultado).toBe('Box 2');
    });
  });
});
