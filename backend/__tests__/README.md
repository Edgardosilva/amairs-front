# Tests - Sistema de Agendamiento

## 🚀 Comandos

```bash
# Ejecutar tests
npm test

# Ejecutar en modo watch (útil durante desarrollo)
npm run test:watch

# Ver coverage (qué % del código está cubierto)
npm run test:coverage
```

## 📂 Estructura

```
__tests__/
└── verificarBox.test.js    # Tests para lógica de asignación de boxes
```

## 📖 Cómo Leer los Tests

Cada test sigue el patrón **DADO-CUANDO-ENTONCES**:

```javascript
test('Descripción clara de lo que se testea', async () => {
  // DADO: Estado inicial / Precondiciones
  mockDb.execute.mockResolvedValue([[...]]);

  // CUANDO: Acción que se ejecuta
  const resultado = await verificarBox(...);

  // ENTONCES: Resultado esperado
  expect(resultado).toBe('Gym');
});
```

## 🎯 Reglas de Negocio Cubiertas

| Regla | Descripción | Tests |
|-------|-------------|-------|
| Entrenamiento Funcional | Solo en Gym | 2 tests |
| Radiofrecuencia | Solo en Box 2 | 2 tests |
| Limpiezas Faciales | Solo 1 a la vez | 3 tests |
| Capacidad | Máximo 3 boxes | 2 tests |
| Compartibles | cs > 1 pueden compartir | 1 test |
| Solapamiento | Detectar conflictos horarios | 2 tests |

**Total: 13 tests** ✅

## 📊 Coverage Actual

```
verificarBox.js: 70.58% coverage
```

Esto significa que más del 70% del código está siendo ejecutado y validado por los tests.

## 🔧 Mantenimiento

### Al agregar nuevos procedimientos:

1. Identifica si tiene reglas especiales
2. Agrega tests siguiendo el patrón existente
3. Ejecuta `npm test` para validar

### Al modificar lógica existente:

1. Modifica el código en `helpers/verificarBox.js`
2. Ejecuta `npm test`
3. Si los tests fallan, actualízalos según la nueva lógica
4. Commit solo cuando todos los tests pasen

## 🐛 Debugging

Si un test falla:

1. Lee el mensaje de error cuidadosamente
2. Revisa la sección **DADO** (precondiciones)
3. Verifica la sección **ENTONCES** (expectativa)
4. Ejecuta solo ese test: `npm test -- -t "nombre del test"`

## 📝 Ejemplo de Agregar un Nuevo Test

```javascript
test('Descripción de lo que debe hacer', async () => {
  // DADO: Estado inicial
  mockDb.execute.mockResolvedValue([[
    { box: 'Box 1', concurrent_sessions: 1, procedimiento_id: 5 }
  ]]);

  // CUANDO: Ejecutar función
  const resultado = await verificarBox(
    '2025-12-05',
    '10:00:00',
    '11:00:00',
    'Cualquier box',
    3,
    7  // ID del procedimiento
  );

  // ENTONCES: Validar resultado
  expect(resultado).toBe('Box 2');
});
```

## 💡 Tips

- **Tests verdes ✅**: El código funciona según lo esperado
- **Tests rojos ❌**: Hay un bug o las expectativas cambiaron
- **Coverage bajo**: Hay código sin testear (agregar más tests)
- **DADO-CUANDO-ENTONCES**: Hace los tests fáciles de leer

## 🔗 Archivos Relacionados

- `helpers/verificarBox.js` - Código que se está testeando
- `jest.config.js` - Configuración de Jest
- `package.json` - Scripts de test disponibles
