# 🎤 Resumen para Presentación - Calculadora de Ecuaciones

## 📋 Estructura de la presentación (15-20 minutos)

### 1. Introducción (2 min)
- **¿Qué es?** App móvil que resuelve ecuaciones lineales y cuadráticas
- **Tecnologías:** React Native + TypeScript + Expo
- **Características:** Resolución, gráficas, procedimiento paso a paso, teclado personalizado

---

### 2. Estructura del Proyecto (3 min)

```
📦 Calculadora-Ecuaciones-Lineales/
├── 📁 types/          → Definiciones de tipos (TableItem, Selection, etc.)
├── 📁 constants/      → Colores y temas (colors.ts)
├── 📁 utils/          → Funciones lógicas puras
│   ├── equationValidation.ts   → Valida formato de ecuaciones
│   ├── equationSolver.ts       → Resuelve matemáticamente
│   └── procedureGenerator.ts   → Genera pasos del procedimiento
├── 📁 components/     → Componentes reutilizables de UI
│   ├── ResultBox.tsx           → Muestra resultado
│   ├── EquationInput.tsx       → Input + teclado personalizado
│   ├── EquationTypeSwitch.tsx  → Switch lineal/cuadrática
│   ├── GraphSection.tsx        → Gráfica + tabla
│   └── ProcedureSection.tsx    → Procedimiento paso a paso
├── 📁 styles/         → Estilos compartidos
└── App.tsx            → Componente principal (orquestador)
```

**Concepto clave:** Separación de responsabilidades
- **types/** = Estructuras de datos
- **utils/** = Lógica de negocio (matemáticas, validación)
- **components/** = Interfaz de usuario
- **App.tsx** = Coordina todo

---

### 3. Flujo de la Aplicación (5 min)

#### 3.1 Usuario interactúa
```
Usuario toca input 
→ Se abre teclado personalizado (NO el del teléfono)
→ Usuario escribe: "2x + 4 = 10"
→ Presiona "CALCULAR SOLUCIÓN"
```

#### 3.2 Proceso de resolución
```
App.tsx → solveEquation()
    ↓
¿Es cuadrática? NO → solveLinear()
    ↓
1. validateLinearEquation("2x + 4 = 10") → ✅ válida
2. solveLinearEquation("2x + 4 = 10")
   - Crea función: f(x) = (2x+4) - 10 = 2x - 6
   - Busca x donde f(x) = 0 (entre -100 y 100)
   - Encuentra: x = 3
   - Genera tabla: x=-5, y=... x=-4, y=... etc.
3. generateLinearProcedure()
   - Genera pasos: ["Ecuación inicial: ...", "Restar 4: ...", etc.]
    ↓
Actualiza estados:
- solution = "3"
- tableData = [...]
- procedureSteps = [...]
```

#### 3.3 Renderizado del resultado
```
App.tsx re-renderiza
→ ResultBox muestra: "Resultado: x = 3"
→ Botones "VER GRÁFICA" y "VER PROCEDIMIENTO" aparecen
→ Usuario puede ver gráfica (GraphSection) y procedimiento (ProcedureSection)
```

---

### 4. Componentes Clave Explicados (5 min)

#### A) `App.tsx` - El Orquestador
```typescript
// Estados (8 estados)
const [equation, setEquation] = useState("");
const [solution, setSolution] = useState(null);
// ... etc

// Funciones principales
solveEquation()  → Decide qué resolver
solveLinear()    → Resuelve ecuaciones lineales
solveQuadratic() → Resuelve ecuaciones cuadráticas
resetAll()       → Limpia todo

// Render
return (
  <ScrollView>
    <EquationTypeSwitch />  {/* Cambia tipo */}
    <ResultBox />            {/* Muestra resultado */}
    <EquationInput />        {/* Input + teclado */}
    <Botones />
    {showTable && <GraphSection />}
    {showProcedure && <ProcedureSection />}
  </ScrollView>
);
```

#### B) `EquationInput.tsx` - Teclado Personalizado
**Características especiales:**
```typescript
<TextInput
  showSoftInputOnFocus={false}  // ← NO abre teclado nativo
  onFocus={handleFocus}         // ← Abre teclado personalizado
/>

// Funciones importantes
insertText(text)  → Inserta texto en posición del cursor
deleteText()      → Borra carácter anterior o selección
moveCursor(dir)   → Mueve cursor izquierda/derecha
```

**¿Por qué teclado personalizado?**
- Mejor UX para escribir ecuaciones
- Incluye botones especiales (x, x², espacios)
- Más control sobre la experiencia

#### C) `equationSolver.ts` - El Cerebro Matemático

**Para ecuaciones lineales:**
```
Ecuación: 2x + 4 = 10
1. Crea función: f(x) = 2x + 4 - 10 = 2x - 6
2. Busca x donde f(x) = 0
3. Probando valores: x = 3 → f(3) = 0 ✅
4. Genera tabla: x=-5, y=... hasta x=5, y=...
```

**Para ecuaciones cuadráticas:**
```
Ecuación: x² + 2x - 3 = 0
1. Extrae: a=1, b=2, c=-3
2. Calcula: Δ = b² - 4ac = 16
3. Aplica fórmula: x = (-b ± √Δ) / 2a
   x₁ = (-2 + 4) / 2 = 1
   x₂ = (-2 - 4) / 2 = -3
4. Genera tabla para parábola
```

#### D) Validación con Expresiones Regulares
```typescript
// Valida: "2x + 4 = 10"
const pattern = /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i;
//           ↑          ↑         ↑
//         Signo   Coeficiente  Término constante opcional

// ✅ "2x + 4 = 10" → válida
// ✅ "x - 3 = 5" → válida
// ❌ "2x² + 4 = 10" → inválida (tiene x²)
```

---

### 5. Conceptos de React Native (3 min)

#### Hooks Principales
```typescript
// useState - Almacena datos que cambian
const [count, setCount] = useState(0);
setCount(5); // React re-renderiza automáticamente

// useEffect - Efectos secundarios
useEffect(() => {
  resetAll();  // Se ejecuta cuando cambia isSecondDegree
}, [isSecondDegree]);
```

#### Componentes vs Funciones
```typescript
// Componente recibe props y retorna UI
const ResultBox = ({ solution, isSecondDegree }) => {
  return <View>...</View>;
};

// Función pura recibe datos y retorna datos
const solveLinearEquation = (equation) => {
  // ... cálculos
  return { solution, tableData };
};
```

---

### 6. Demo en Vivo (2 min)
1. **Mostrar estructura de carpetas**
2. **Escribir ecuación:** "2x + 4 = 10"
3. **Mostrar resultado:** x = 3
4. **Mostrar gráfica:** Línea recta
5. **Mostrar procedimiento:** Pasos numerados
6. **Cambiar a cuadrática:** "x² + 2x - 3 = 0"
7. **Mostrar resultado:** Dos soluciones
8. **Mostrar gráfica:** Parábola

---

### 7. Preguntas y Respuestas (2 min)

**P: ¿Por qué tantas carpetas?**
R: Separación de responsabilidades. Cada carpeta tiene un propósito específico. Facilita mantenimiento y escalabilidad.

**P: ¿Cómo funciona el teclado personalizado?**
R: `showSoftInputOnFocus={false}` desactiva el teclado nativo. Nosotros controlamos la inserción de texto con funciones JavaScript.

**P: ¿Cómo se calculan las soluciones?**
R: Para lineales: búsqueda por fuerza bruta. Para cuadráticas: fórmula cuadrática clásica.

**P: ¿Qué hace mathjs?**
R: Evalúa expresiones matemáticas. `evaluate("2x+4", {x: 5})` = 14.

**P: ¿Por qué TypeScript?**
R: Tipos estáticos ayudan a encontrar errores antes de ejecutar. Mejor autocompletado en el editor.

---

## 🎯 Puntos Clave para Destacar

1. ✅ **Arquitectura modular** - Código organizado y mantenible
2. ✅ **Separación de responsabilidades** - Lógica separada de UI
3. ✅ **Reutilización** - Componentes y funciones reutilizables
4. ✅ **Experiencia de usuario** - Teclado personalizado, gráficas interactivas
5. ✅ **Validación robusta** - Expresiones regulares y manejo de errores
6. ✅ **Tipado fuerte** - TypeScript previene errores

---

## 📝 Notas Adicionales

### Si preguntan sobre...
- **Mathjs:** Librería que evalúa expresiones matemáticas dinámicamente
- **React Native Chart Kit:** Librería para crear gráficas bonitas
- **Expo:** Simplifica desarrollo React Native, no necesitas configurar Android Studio
- **Expresiones regulares:** Patrones para buscar/validar texto
- **Fórmula cuadrática:** Fórmula matemática estándar para resolver ax² + bx + c = 0

### Comandos útiles
```bash
npm start        # Inicia servidor de desarrollo
npm run android  # Abre en emulador Android
npm run ios      # Abre en simulador iOS
```

---

¡Mucha suerte con tu presentación! 🚀

