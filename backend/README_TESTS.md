# Tests - Sistema de Agendamiento

## 📋 Resumen

Este directorio contiene tests para las restricciones críticas del sistema de agendamiento de Amaris. Los tests garantizan que las reglas de negocio se mantengan consistentes durante el desarrollo futuro.

## 🧪 Tests Implementados

### 1. `verificarBox.test.js` - Asignación de Boxes

Tests que validan la lógica de asignación de boxes según las reglas del negocio.

#### Reglas Probadas:

**Regla 1: Entrenamiento Funcional (ID: 6)**
- ✅ Debe asignar Gym cuando está disponible
- ✅ Debe retornar null cuando Gym está ocupado

**Regla 2: Radiofrecuencia (ID: 10)**
- ✅ Debe asignar Box 2 cuando está disponible
- ✅ Debe retornar null cuando Box 2 está ocupado

**Regla 3: Limpiezas Faciales (IDs: 1, 2, 3)**
- ✅ Debe permitir agendar cuando no hay otra limpieza facial
- ✅ Debe rechazar cuando ya hay otra limpieza facial
- ✅ Limpieza puede coexistir con masajes en diferentes boxes

**Regla 4: Capacidad de Boxes**
- ✅ Debe asignar box disponible cuando hay múltiples procedimientos
- ✅ Debe retornar null cuando todos los boxes están ocupados

**Regla 5: Procedimientos Compartibles (cs > 1)**
- ✅ Masajes pueden usar cualquier box disponible

**Escenarios Complejos**
- ✅ Debe permitir 4 procedimientos simultáneos: 1 Limpieza + 1 Masaje + 1 Presoterapia + 1 Entrenamiento

**Validación de Solapamiento**
- ✅ Debe detectar solapamiento al inicio del horario
- ✅ Debe detectar solapamiento al final del horario

### 2. `disponibilidad.test.js` - Horarios Disponibles

Tests que validan la lógica de disponibilidad de horarios para el usuario.

#### Casos Probados:

**Horarios Vacíos**
- ✅ Debe retornar todos los horarios cuando no hay citas

**Bloqueo por Limpiezas Faciales**
- ✅ Debe bloquear horario si ya hay una limpieza facial
- ✅ Debe permitir horario si limpieza pero hay boxes disponibles y no es limpieza

**Bloqueo por Gym Ocupado**
- ✅ Debe bloquear horario para Entrenamiento si Gym ocupado

**Bloqueo por Box 2 Ocupado**
- ✅ Debe bloquear horario para Radiofrecuencia si Box 2 ocupado

**Bloqueo por Capacidad**
- ✅ Debe bloquear horario cuando 3 boxes están ocupados
- ✅ Debe permitir horario cuando hay box disponible

**Solapamiento de Duración**
- ✅ Debe bloquear horarios durante toda la duración del procedimiento
- ✅ Debe permitir horario después de que termine el procedimiento

## 🚀 Comandos Disponibles

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
npm run test:watch
```

### Ejecutar tests con reporte de cobertura
```bash
npm run test:coverage
```

## 📊 Resultados Actuales

```
Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Time:        ~0.13s
```

## 🎯 Reglas de Negocio Documentadas

### Procedimientos Especiales

| Procedimiento | ID | Restricción |
|--------------|-------|-------------|
| Entrenamiento Funcional | 6 | Solo Gym |
| Radiofrecuencia | 10 | Solo Box 2 |
| Limpiezas Faciales | 1, 2, 3 | Solo 1 a la vez (cualquier ID) |

### Capacidad de Boxes

- **Máximo**: 3 boxes simultáneos (Box 1, Box 2, Box 3)
- **Gym**: Independiente, cuenta aparte
- **Box 2**: Uso dual (procedimientos normales + Radiofrecuencia exclusiva)

### Sesiones Concurrentes (cs)

- **cs = 1**: Procedimiento exclusivo, requiere box dedicado
- **cs > 1**: Puede compartir horario en diferentes boxes

## 🔄 Flujo de Agendamiento

```
1. Usuario selecciona procedimiento
2. Sistema verifica disponibilidad de horarios
   └─ Filtra según reglas de Limpiezas Faciales
   └─ Filtra según capacidad de boxes
   └─ Filtra según Gym/Box 2 si aplica
3. Usuario selecciona horario
4. Sistema asigna box
   └─ Verifica restricciones específicas
   └─ Verifica solapamiento
   └─ Asigna box disponible
5. Confirmación
```

## 🛠️ Mantenimiento

### Al Agregar Nuevos Procedimientos

1. Identificar si tiene restricciones especiales
2. Determinar el valor de `concurrent_sessions`
3. Agregar tests si introduce nueva lógica
4. Ejecutar suite completo para validar

### Al Modificar Lógica de Boxes

1. Revisar tests existentes
2. Actualizar tests que fallen
3. Agregar nuevos tests para nueva funcionalidad
4. Verificar que todos los tests pasen

## 📝 Notas Técnicas

- Los tests usan **Jest** con soporte para ES Modules
- Se usa `--experimental-vm-modules` para compatibilidad
- Los tests recrean la lógica inline para facilitar el testing sin BD
- Mock database implementado con `jest.fn()`

## ⚠️ Consideraciones Futuras

1. **Integración con BD Real**: Los tests actuales son unitarios. Considerar agregar tests de integración.
2. **Tests de Performance**: Validar tiempos de respuesta con alta carga.
3. **Tests E2E**: Probar flujo completo desde frontend.
4. **CI/CD**: Integrar tests en pipeline de deployment.

## 🐛 Debugging

Si un test falla:

1. Leer el mensaje de error cuidadosamente
2. Verificar que los IDs de procedimientos coincidan con BD
3. Revisar que las reglas de negocio no hayan cambiado
4. Ejecutar test individual: `npm test -- verificarBox.test.js`
5. Usar modo watch para desarrollo iterativo

## 📚 Referencias

- **Jest Documentation**: https://jestjs.io/
- **ES Modules in Jest**: https://jestjs.io/docs/ecmascript-modules
- **Archivo de configuración**: `jest.config.js`
