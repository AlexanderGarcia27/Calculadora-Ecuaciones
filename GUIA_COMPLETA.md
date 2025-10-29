# 📚 Guía Completa: Calculadora de Ecuaciones Lineales y Cuadráticas

## 🎯 Índice
1. [¿Qué es esta aplicación?](#qué-es-esta-aplicación)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Configuración inicial del proyecto](#configuración-inicial-del-proyecto)
4. [Estructura de carpetas explicada](#estructura-de-carpetas-explicada)
5. [Archivos principales y su función](#archivos-principales-y-su-función)
6. [Flujo de la aplicación](#flujo-de-la-aplicación)
7. [Explicación detallada de componentes](#explicación-detallada-de-componentes)
8. [Explicación de funciones y utilidades](#explicación-de-funciones-y-utilidades)

---

## ¿Qué es esta aplicación?

Es una aplicación móvil desarrollada con **React Native** que permite:
- ✅ Resolver ecuaciones lineales (primer grado): `ax + b = c`
- ✅ Resolver ecuaciones cuadráticas (segundo grado): `ax² + bx + c = d`
- ✅ Ver el procedimiento paso a paso de la solución
- ✅ Visualizar gráficas en plano cartesiano
- ✅ Mostrar tablas de valores
- ✅ Teclado personalizado para escribir ecuaciones

---

## Tecnologías utilizadas

### 1. **React Native**
- Framework para crear aplicaciones móviles nativas usando JavaScript/TypeScript
- Permite una sola base de código para iOS y Android

### 2. **Expo**
- Herramienta que facilita el desarrollo de React Native
- No necesitas configurar Android Studio o Xcode manualmente
- Permite probar la app con Expo Go en tu teléfono

### 3. **TypeScript**
- Superset de JavaScript que añade tipos estáticos
- Ayuda a detectar errores antes de ejecutar el código

### 4. **Librerías adicionales**
- `mathjs`: Para evaluar expresiones matemáticas
- `react-native-chart-kit`: Para crear gráficas
- `react-native-svg`: Soporte para gráficos SVG

---

## Configuración inicial del proyecto

### Paso 1: Crear el proyecto
```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Crear nuevo proyecto
npx create-expo-app Calculadora-Ecuaciones-Lineales --template blank-typescript

# Entrar a la carpeta
cd Calculadora-Ecuaciones-Lineales
```

### Paso 2: Instalar dependencias
```bash
npm install mathjs react-native-chart-kit react-native-svg
```

### Paso 3: Estructura de carpetas
```
Calculadora-Ecuaciones-Lineales/
├── App.tsx                    # Componente principal
├── index.ts                   # Punto de entrada
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración de TypeScript
├── types/                    # Definiciones de tipos
│   └── index.ts
├── constants/                # Constantes (colores, etc.)
│   └── colors.ts
├── utils/                    # Funciones auxiliares
│   ├── equationValidation.ts
│   ├── equationSolver.ts
│   └── procedureGenerator.ts
├── components/               # Componentes reutilizables
│   ├── ResultBox.tsx
│   ├── EquationInput.tsx
│   ├── EquationTypeSwitch.tsx
│   ├── GraphSection.tsx
│   └── ProcedureSection.tsx
└── styles/                   # Estilos compartidos
    └── styles.ts
```

---

## Estructura de carpetas explicada

### 📁 `types/`
**Propósito**: Define las interfaces y tipos de TypeScript que se usan en toda la aplicación.

**¿Por qué separar los tipos?**
- Mantiene el código organizado
- Reutilización de tipos en múltiples archivos
- Facilita el mantenimiento

**Contenido**:
```typescript
// types/index.ts
export interface TableItem {
  x: number;      // Valor de x en la tabla
  y: string;      // Valor de y (como string para formateo)
}

export interface Selection {
  start: number;  // Posición inicial del cursor
  end: number;    // Posición final del cursor
}

export interface QuadraticCoefficients {
  a: number;              // Coeficiente de x²
  b: number;              // Coeficiente de x
  c: number;              // Término constante
  originalRight: number;  // Valor original del lado derecho
}
```

---

### 📁 `constants/`
**Propósito**: Almacena valores constantes que se usan en toda la aplicación, como colores.

**¿Por qué separar constantes?**
- Fácil cambiar el tema de la app en un solo lugar
- Evita duplicación de código
- Mejora la consistencia visual

**Contenido** (`colors.ts`):
```typescript
// Define colores para modo claro
export const CLR_LIGHT_PRIMARY = '#00BCD4';     // Azul turquesa
export const CLR_LIGHT_ACCENT = '#FF9800';      // Naranja
export const CLR_LIGHT_TOGGLE = '#00BFA5';      // Verde turquesa
export const CLR_LIGHT_PROCEDURE = '#7B1FA2';   // Morado

// Define colores para modo oscuro (segundo grado)
export const CLR_DARK_GRAY_1 = '#8a7d7dff';
export const CLR_DARK_GRAY_2 = '#b6b3b3ff';

// Función que retorna los colores según el modo
export const getThemeColors = (isSecondDegree: boolean) => {
  // Retorna objeto con todos los colores del tema
  // Si isSecondDegree es true, usa colores oscuros
  // Si es false, usa colores claros
}
```

---

### 📁 `utils/`
**Propósito**: Contiene funciones auxiliares puras (sin estado) que realizan tareas específicas.

**¿Por qué separar utilidades?**
- Código reutilizable
- Fácil de probar
- Separación de lógica de negocio y UI

#### `equationValidation.ts`
**Función**: Valida que las ecuaciones ingresadas tengan el formato correcto.

**Funciones principales**:
```typescript
validateLinearEquation(equation: string): boolean
// Valida si la ecuación es del tipo: ax + b = c
// Ejemplo válido: "2x + 4 = 10"
// Usa expresiones regulares para verificar el patrón

validateQuadraticEquation(equation: string): boolean
// Valida si la ecuación es del tipo: ax² + bx + c = d
// Ejemplo válido: "x² + 2x - 3 = 0"
// Verifica que tenga x², opcional x y término constante
```

#### `equationSolver.ts`
**Función**: Resuelve las ecuaciones matemáticamente.

**Funciones principales**:
```typescript
solveLinearEquation(equation: string): {...} | null
// 1. Separa la ecuación en izquierda y derecha del "="
// 2. Crea una función f(x) = left - right
// 3. Busca el valor de x donde f(x) = 0 (entre -100 y 100)
// 4. Genera tabla de valores de -5 a 5
// 5. Retorna solución y tabla

solveQuadraticEquation(equation: string): {...} | null
// 1. Extrae coeficientes a, b, c usando regex
// 2. Calcula discriminante: Δ = b² - 4ac
// 3. Aplica fórmula cuadrática según el discriminante:
//    - Δ > 0: Dos soluciones reales
//    - Δ = 0: Una solución (doble)
//    - Δ < 0: Soluciones complejas
// 4. Genera tabla de valores para la gráfica
// 5. Retorna solución, tabla y discriminante

extractQuadraticCoefficients(equation: string): {...} | null
// Extrae los valores de a, b, c usando expresiones regulares
// Convierte la ecuación a forma estándar: ax² + bx + c = 0
```

#### `procedureGenerator.ts`
**Función**: Genera los pasos del procedimiento matemático.

**Funciones principales**:
```typescript
generateLinearProcedure(equation: string): string[]
// Genera array de strings con los pasos:
// 1. Ecuación inicial
// 2. Restar término constante
// 3. Dividir por coeficiente de x

generateQuadraticProcedure(coefficients, discriminant, originalRight): string[]
// Genera array de strings con los pasos:
// 1. Ecuación inicial
// 2. Conversión a forma estándar (si es necesario)
// 3. Identificación de coeficientes
// 4. Cálculo del discriminante
// 5. Aplicación de fórmula cuadrática
// 6. Resultado final
```

---

### 📁 `components/`
**Propósito**: Contiene componentes React reutilizables que forman la interfaz.

**¿Por qué separar componentes?**
- Código modular y reutilizable
- Fácil de mantener y actualizar
- Separación de responsabilidades

#### `ResultBox.tsx`
**Propósito**: Muestra el resultado de la ecuación resuelta.

**Props que recibe**:
- `solution: string | null` - La solución a mostrar
- `isSecondDegree: boolean` - Si es modo oscuro o claro

**Qué hace**:
- Si hay solución, muestra "Resultado: x = ..."
- Si no hay solución, muestra placeholder
- Cambia colores según el tema

#### `EquationTypeSwitch.tsx`
**Propósito**: Permite cambiar entre ecuaciones lineales y cuadráticas.

**Props que recibe**:
- `isSecondDegree: boolean` - Estado actual
- `onToggle: (value: boolean) => void` - Función para cambiar el estado

**Qué hace**:
- Muestra un Switch de React Native
- Cambia el título según el modo
- Resetea todo cuando cambia de modo

#### `EquationInput.tsx`
**Propósito**: Input para escribir la ecuación con teclado personalizado.

**Props que recibe**:
- `equation: string` - Texto actual
- `setEquation: (text: string) => void` - Actualizar ecuación
- `selection: Selection` - Posición del cursor
- `setSelection: (selection: Selection) => void` - Actualizar cursor
- `showKeyboard: boolean` - Si mostrar teclado
- `setShowKeyboard: (show: boolean) => void` - Toggle teclado
- `isSecondDegree: boolean` - Tema

**Funciones internas**:
```typescript
insertText(text: string)
// Inserta texto en la posición del cursor
// Actualiza la selección del cursor

deleteText()
// Elimina carácter anterior o selección
// Mueve cursor a posición correcta

moveCursor(direction: 'left' | 'right')
// Mueve el cursor una posición
// Actualiza la selección visual
```

**Características especiales**:
- `showSoftInputOnFocus={false}` - NO abre teclado nativo del teléfono
- `onFocus={handleFocus}` - Abre automáticamente teclado personalizado
- Teclado personalizado con números, operadores, x, x²

#### `GraphSection.tsx`
**Propósito**: Muestra tabla de valores y gráfica de la ecuación.

**Props que recibe**:
- `tableData: TableItem[]` - Array de puntos (x, y)
- `isSecondDegree: boolean` - Tema y tipo de gráfica

**Qué hace**:
- Renderiza tabla de valores
- Crea gráfica usando `LineChart` de react-native-chart-kit
- Muestra ejes X e Y superpuestos
- Explica la simbolización de la gráfica

#### `ProcedureSection.tsx`
**Propósito**: Muestra los pasos del procedimiento matemático.

**Props que recibe**:
- `procedureSteps: string[]` - Array de pasos
- `isSecondDegree: boolean` - Tema

**Qué hace**:
- Renderiza lista numerada de pasos
- Usa colores según el tema

---

### 📁 `styles/`
**Propósito**: Estilos CSS compartidos.

**Contenido** (`styles.ts`):
```typescript
export const commonStyles = StyleSheet.create({
  container: {},              // Contenedor principal
  contentContainer: {         // Padding y espaciado
    paddingTop: 50,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  title: {                    // Título principal
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {                   // Estilo de botones
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    // ... sombras
  },
  buttonText: {               // Texto de botones
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
```

---

## Archivos principales y su función

### `App.tsx` - Componente Principal

**Estructura del componente**:

```typescript
export default function App() {
  // ========== ESTADOS (useState) ==========
  // Almacenan datos que cambian durante la ejecución
  
  const [equation, setEquation] = useState<string>("");
  // Almacena la ecuación que el usuario escribe
  
  const [solution, setSolution] = useState<string | null>(null);
  // Almacena la solución calculada
  
  const [tableData, setTableData] = useState<TableItem[]>([]);
  // Almacena puntos (x, y) para la gráfica
  
  const [showTable, setShowTable] = useState<boolean>(false);
  // Controla si se muestra la gráfica
  
  const [showProcedure, setShowProcedure] = useState<boolean>(false);
  // Controla si se muestra el procedimiento
  
  const [procedureSteps, setProcedureSteps] = useState<string[]>([]);
  // Almacena los pasos del procedimiento
  
  const [isSecondDegree, setIsSecondDegree] = useState<boolean>(false);
  // Controla si es ecuación cuadrática o lineal
  
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  // Controla si se muestra el teclado personalizado
  
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  // Controla posición del cursor en el input

  // ========== FUNCIONES PRINCIPALES ==========
  
  solveEquation()
  // Decide si resolver lineal o cuadrática según isSecondDegree
  
  solveLinear()
  // 1. Valida formato de ecuación lineal
  // 2. Llama a solveLinearEquation()
  // 3. Actualiza estados: solution, tableData, procedureSteps
  
  solveQuadratic()
  // 1. Valida formato de ecuación cuadrática
  // 2. Llama a solveQuadraticEquation()
  // 3. Actualiza estados: solution, tableData, procedureSteps
  
  resetAll()
  // Resetea todos los estados a valores iniciales
  
  // ========== EFECTOS (useEffect) ==========
  
  useEffect(() => {
    resetAll();
  }, [isSecondDegree]);
  // Se ejecuta cada vez que cambia isSecondDegree
  // Limpia todo cuando se cambia el tipo de ecuación

  // ========== RENDER (JSX) ==========
  // Devuelve la interfaz de usuario
}
```

**Flujo de renderizado**:
1. Renderiza el título
2. Renderiza `EquationTypeSwitch` (para cambiar tipo)
3. Renderiza `ResultBox` (muestra resultado)
4. Renderiza `EquationInput` (input + teclado personalizado)
5. Renderiza botón "CALCULAR SOLUCIÓN"
6. Renderiza botón "REESTABLECER"
7. Si hay solución, renderiza botones para ver gráfica/procedimiento
8. Renderiza `GraphSection` si `showTable` es true
9. Renderiza `ProcedureSection` si `showProcedure` es true

---

### `index.ts` - Punto de Entrada

```typescript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
// Registra App.tsx como el componente raíz de la aplicación
// Expo se encarga de montarlo en la pantalla
```

---

### `package.json` - Configuración del Proyecto

```json
{
  "name": "calculadora-ecuaciones-lineales",
  "version": "1.0.0",
  "main": "index.ts",  // Archivo que se ejecuta primero
  
  "scripts": {
    "start": "expo start",           // Inicia servidor de desarrollo
    "android": "expo start --android", // Abre en emulador Android
    "ios": "expo start --ios",       // Abre en simulador iOS
    "web": "expo start --web"        // Abre en navegador
  },
  
  "dependencies": {
    // Librerías necesarias para que la app funcione
  },
  
  "devDependencies": {
    // Librerías solo para desarrollo (TypeScript, etc.)
  }
}
```

---

## Flujo de la aplicación

### 1. **Inicio de la aplicación**
```
index.ts → App.tsx → Renderiza interfaz inicial
```

### 2. **Usuario escribe ecuación**
```
Usuario toca input 
→ Se abre teclado personalizado automáticamente
→ Usuario presiona botones del teclado
→ insertText() actualiza equation
→ Se actualiza el TextInput visualmente
```

### 3. **Usuario presiona "CALCULAR SOLUCIÓN"**
```
solveEquation() 
→ Verifica isSecondDegree
→ Si false: llama solveLinear()
→ Si true: llama solveQuadratic()

solveLinear():
  1. Valida formato con validateLinearEquation()
  2. Si válida: llama solveLinearEquation()
  3. solveLinearEquation() calcula solución
  4. Genera tabla de valores
  5. Actualiza: solution, tableData
  6. Genera procedimiento con generateLinearProcedure()
  7. Actualiza: procedureSteps

solveQuadratic():
  1. Valida formato con validateQuadraticEquation()
  2. Si válida: llama solveQuadraticEquation()
  3. solveQuadraticEquation():
     - Extrae coeficientes
     - Calcula discriminante
     - Aplica fórmula cuadrática
     - Genera tabla de valores
  4. Actualiza: solution, tableData
  5. Genera procedimiento con generateQuadraticProcedure()
  6. Actualiza: procedureSteps
```

### 4. **Usuario ve resultado**
```
ResultBox muestra: "Resultado: x = ..."
Botones "VER GRÁFICA Y TABLA" y "VER PROCEDIMIENTO" aparecen
```

### 5. **Usuario presiona "VER GRÁFICA Y TABLA"**
```
showTable = true
→ Renderiza GraphSection
→ Muestra tabla de valores
→ Renderiza gráfica con LineChart
```

### 6. **Usuario presiona "VER PROCEDIMIENTO"**
```
showProcedure = true
→ Renderiza ProcedureSection
→ Muestra lista numerada de pasos
```

---

## Explicación detallada de componentes

### Componente: `ResultBox`

**¿Qué hace?**
- Muestra una caja con el resultado de la ecuación
- Cambia su apariencia según si hay resultado o no

**Código explicado**:
```typescript
export default function ResultBox({ solution, isSecondDegree }) {
  // Obtiene colores según el tema
  const colors = getThemeColors(isSecondDegree);

  return (
    <View style={[styles.resultBox, { 
      backgroundColor: colors.CLR_RESULT_BOX,
      borderColor: colors.CLR_RESULT_BORDER 
    }]}>
      {/* Si hay solución, muestra "Resultado: x = ..." */}
      {solution ? (
        <Text style={styles.resultTextSolved}>
          Resultado:{" "}
          <Text style={[styles.solutionValue, { color: colors.CLR_SECONDARY }]}>
            x = {solution}
          </Text>
        </Text>
      ) : (
        // Si no hay solución, muestra placeholder
        <Text style={styles.resultTextPlaceholder}>
          Aquí aparecerá el resultado...
        </Text>
      )}
    </View>
  );
}
```

**Conceptos clave**:
- **Props**: Datos que recibe el componente
- **Condicional**: `{solution ? ... : ...}` - Si solution existe, muestra una cosa, sino otra
- **Estilos dinámicos**: `[{...}, { backgroundColor: ... }]` - Combina estilos estáticos y dinámicos

---

### Componente: `EquationInput`

**¿Qué hace?**
- Renderiza un TextInput para escribir la ecuación
- Renderiza un teclado personalizado con botones
- Maneja inserción, borrado y movimiento del cursor

**Funciones clave**:

#### `insertText(text: string)`
```typescript
const insertText = (text: string): void => {
  // 1. Obtiene posición actual del cursor
  const start = selection.start;
  const end = selection.end;
  
  // 2. Construye nuevo texto:
  //    - Texto antes del cursor + texto nuevo + texto después del cursor
  const newText = equation.substring(0, start) + text + equation.substring(end);
  
  // 3. Actualiza el estado de la ecuación
  setEquation(newText);
  
  // 4. Calcula nueva posición del cursor
  const newCursorPosition = start + text.length;
  
  // 5. Actualiza la selección
  setSelection({ start: newCursorPosition, end: newCursorPosition });
  
  // 6. Actualiza visualmente el cursor en el input nativo
  setTimeout(() => {
    inputRef.current?.setNativeProps({
      selection: { start: newCursorPosition, end: newCursorPosition }
    });
  }, 0);
};
```

**¿Por qué `setTimeout`?**
- React Native necesita tiempo para actualizar el componente
- `setNativeProps` actualiza directamente el input nativo
- Sin setTimeout, a veces no funciona correctamente

#### `deleteText()`
```typescript
const deleteText = (): void => {
  // Caso 1: Cursor sin selección (solo un punto)
  if (selection.start === selection.end && selection.start > 0) {
    // Elimina el carácter ANTES del cursor
    const newText = equation.substring(0, selection.start - 1) + 
                   equation.substring(selection.start);
    setEquation(newText);
    // Mueve cursor una posición atrás
    const newCursorPosition = selection.start - 1;
    setSelection({ start: newCursorPosition, end: newCursorPosition });
  }
  // Caso 2: Hay texto seleccionado
  else if (selection.start !== selection.end) {
    // Elimina todo el texto seleccionado
    const newText = equation.substring(0, selection.start) + 
                   equation.substring(selection.end);
    setEquation(newText);
    // Coloca cursor al inicio de la selección
    setSelection({ start: selection.start, end: selection.start });
  }
};
```

#### `moveCursor(direction)`
```typescript
const moveCursor = (direction: "left" | "right"): void => {
  const newPosition = direction === "left"
    ? Math.max(0, selection.start - 1)        // No puede ser negativo
    : Math.min(equation.length, selection.start + 1); // No puede exceder longitud
  
  setSelection({ start: newPosition, end: newPosition });
  
  setTimeout(() => {
    inputRef.current?.setNativeProps({
      selection: { start: newPosition, end: newPosition }
    });
  }, 0);
};
```

**Prop importante del TextInput**:
```typescript
<TextInput
  showSoftInputOnFocus={false}  // ← NO abre teclado nativo
  onFocus={handleFocus}         // ← Abre teclado personalizado
  ...
/>
```

---

## Explicación de funciones y utilidades

### `validateLinearEquation()`

**Función completa**:
```typescript
export const validateLinearEquation = (eq: string): boolean => {
  // 1. Verifica que eq exista y sea string
  if (!eq || typeof eq !== "string") return false;
  
  // 2. Elimina todos los espacios
  const normalized = eq.replace(/\s+/g, "");
  
  // 3. Separa en izquierda y derecha del "="
  const parts = normalized.split("=");
  if (parts.length !== 2) return false;  // Debe haber exactamente un "="
  
  const left = parts[0];   // Lado izquierdo: "2x+4"
  const right = parts[1];  // Lado derecho: "10"
  
  // 4. Valida que el lado derecho sea solo un número
  // /^[-+]?\d*\.?\d+$/ significa:
  // ^: Inicio de string
  // [-+]?: Signo opcional (+ o -)
  // \d*: Cero o más dígitos
  // \.?: Punto opcional (para decimales)
  // \d+: Uno o más dígitos
  // $: Fin de string
  if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;
  
  // 5. Valida que el lado izquierdo tenga formato: ax+b o ax
  // /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i significa:
  // [-+]?\d*\.?\d*x: Coeficiente opcional + x
  // ([+-]\d*\.?\d+)?: Término constante opcional
  // i: Case insensitive
  const leftPattern = /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i;
  return leftPattern.test(left);
};
```

**Ejemplos**:
- ✅ `"2x + 4 = 10"` → `true`
- ✅ `"x - 3 = 5"` → `true`
- ✅ `"-3x = 12"` → `true`
- ❌ `"2x² + 4 = 10"` → `false` (tiene x²)
- ❌ `"2x + 4 = x + 1"` → `false` (lado derecho tiene x)

---

### `solveLinearEquation()`

**Función completa**:
```typescript
export const solveLinearEquation = (equation: string) => {
  // 1. Separa la ecuación
  const [left, right] = equation.split("=");
  
  // 2. Crea una función que representa: f(x) = left - right
  // Por ejemplo, si left = "2x+4" y right = "10"
  // f(x) = (2x+4) - 10 = 2x - 6
  // Queremos encontrar x donde f(x) = 0
  const f = (x: number): number => 
    evaluate(left, { x }) - evaluate(right, { x });
  
  // 3. Busca la solución probando valores de -100 a 100
  let x = 0;
  let found = false;
  for (let i = -100; i <= 100; i += 0.1) {
    // Si f(x) es muy cercano a 0 (menos de 0.001), encontramos la solución
    if (Math.abs(f(i)) < 0.001) {
      x = parseFloat(i.toFixed(2));  // Redondea a 2 decimales
      found = true;
      break;
    }
  }
  
  if (!found) return null;
  
  // 4. Genera tabla de valores para la gráfica
  const tabla: TableItem[] = [];
  for (let i = -5; i <= 5; i++) {
    const y = evaluate(left, { x: i }).toFixed(2);
    tabla.push({ x: i, y });
  }
  
  return {
    solution: x.toString(),
    tableData: tabla,
  };
};
```

**¿Cómo funciona `evaluate()`?**
- `evaluate("2x+4", { x: 5 })` → `14`
- `evaluate("x²+2x", { x: 3 })` → `15`
- Evalúa expresiones matemáticas reemplazando variables

---

### `solveQuadraticEquation()`

**Fórmula cuadrática**:
```
x = (-b ± √(b² - 4ac)) / 2a

Donde:
- a = coeficiente de x²
- b = coeficiente de x
- c = término constante
- Δ (discriminante) = b² - 4ac
```

**Función completa**:
```typescript
export const solveQuadraticEquation = (equation: string) => {
  // 1. Extrae coeficientes
  const coefficients = extractQuadraticCoefficients(equation);
  if (!coefficients) return null;
  
  const { a, b, c, originalRight } = coefficients;
  
  // 2. Calcula discriminante
  const discriminant = b * b - 4 * a * c;
  
  let solution: string = "";
  let tabla: TableItem[] = [];
  
  // 3. Evalúa según el discriminante
  
  // Caso 1: Δ > 0 → Dos soluciones reales
  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    solution = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
  }
  // Caso 2: Δ = 0 → Una solución (doble)
  else if (discriminant === 0) {
    const x = -b / (2 * a);
    solution = `x = ${x.toFixed(2)}`;
  }
  // Caso 3: Δ < 0 → Soluciones complejas
  else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    solution = `x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
  }
  
  // 4. Genera tabla para gráfica
  const cOriginal = c + originalRight;
  for (let i = -10; i <= 10; i += 1) {
    const y = (a * i * i + b * i + cOriginal).toFixed(2);
    tabla.push({ x: i, y });
  }
  
  return {
    solution,
    tableData: tabla,
    discriminant,
    coefficients,
  };
};
```

**Ejemplo práctico**:
```
Ecuación: x² + 2x - 3 = 0

1. Extrae coeficientes:
   a = 1, b = 2, c = -3

2. Calcula discriminante:
   Δ = 2² - 4(1)(-3) = 4 + 12 = 16

3. Como Δ > 0, hay dos soluciones:
   x₁ = (-2 + √16) / 2 = (-2 + 4) / 2 = 1
   x₂ = (-2 - √16) / 2 = (-2 - 4) / 2 = -3
```

---

### `extractQuadraticCoefficients()`

**Función completa**:
```typescript
export const extractQuadraticCoefficients = (eq: string) => {
  // 1. Normaliza y separa
  const normalized = eq.replace(/\s+/g, "");
  const parts = normalized.split("=");
  const left = parts[0];
  const right = parts[1] || "0";
  
  // 2. Usa expresiones regulares para extraer coeficientes
  
  // Busca: (coeficiente opcional)x²
  // Ejemplo: "2x²" → ["2x²", "2"] o "x²" → ["x²", ""]
  const aMatch = left.match(/([-+]?\d*\.?\d*)x²/i);
  
  // Busca: (signo + coeficiente)x (pero NO x²)
  // Ejemplo: "+2x" → ["+2x", "+2"]
  const bMatch = left.match(/([+-]\d*\.?\d*)x(?!²)/i);
  
  // Busca: (signo + número) que NO tenga x después
  // Ejemplo: "-3" → ["-3", "-3"]
  const cMatch = left.match(/([+-]\d*\.?\d+)(?!x)/);
  
  // 3. Parsea a números
  const a = aMatch ? parseFloat(aMatch[1] || "1") : 0;  // Si no hay, default 1
  const b = bMatch ? parseFloat(bMatch[1]) : 0;        // Si no hay, default 0
  const cLeft = cMatch ? parseFloat(cMatch[1]) : 0;    // Si no hay, default 0
  const rightValue = parseFloat(right);
  
  // 4. Convierte a forma estándar: ax² + bx + c = 0
  // Si ecuación es: x² + 2x - 3 = 5
  // Necesitamos: x² + 2x - 3 - 5 = 0
  // Entonces: x² + 2x - 8 = 0
  // Por eso: c = cLeft - rightValue
  const c = cLeft - rightValue;
  
  return { a, b, c, originalRight: rightValue };
};
```

**Ejemplos**:
```
"x² + 2x - 3 = 5"
→ a = 1, b = 2, cLeft = -3, rightValue = 5
→ c = -3 - 5 = -8
→ Forma estándar: x² + 2x - 8 = 0

"2x² - x + 1 = 0"
→ a = 2, b = -1, cLeft = 1, rightValue = 0
→ c = 1 - 0 = 1
→ Forma estándar: 2x² - x + 1 = 0
```

---

## Conceptos importantes de React Native

### 1. **Hooks: useState**
```typescript
const [valor, setValor] = useState(valorInicial);
```
- Almacena datos que pueden cambiar
- Cuando cambias con `setValor()`, React re-renderiza el componente
- Ejemplo: `const [count, setCount] = useState(0);`

### 2. **Hooks: useEffect**
```typescript
useEffect(() => {
  // Código que se ejecuta
}, [dependencias]);
```
- Se ejecuta después del render
- Si cambian las dependencias, se vuelve a ejecutar
- Útil para efectos secundarios (reseteo, llamadas API, etc.)

### 3. **Componentes**
```typescript
const MiComponente = ({ prop1, prop2 }) => {
  return <View>...</View>;
};
```
- Funciones que retornan JSX (interfaz)
- Reciben props (datos del padre)
- Reutilizables

### 4. **JSX**
- Sintaxis similar a HTML
- Permite usar JavaScript dentro con `{}`
- Ejemplo: `<Text>{variable}</Text>`

### 5. **Estilos con StyleSheet**
```typescript
const styles = StyleSheet.create({
  contenedor: {
    padding: 10,
    backgroundColor: '#fff',
  }
});
```
- Similar a CSS pero escrito en JavaScript
- Más eficiente que objetos inline

---

## Tips para la presentación

1. **Empieza explicando la estructura general**
   - Muestra el árbol de carpetas
   - Explica qué va en cada carpeta

2. **Explora un componente completo**
   - Toma `ResultBox` como ejemplo
   - Muestra props, estado, render

3. **Demuestra el flujo completo**
   - Escribe una ecuación
   - Muestra cómo fluye la data
   - Muestra el resultado

4. **Explica funciones clave**
   - `validateLinearEquation` - cómo funciona regex
   - `solveQuadraticEquation` - matemáticas detrás

5. **Muestra el teclado personalizado**
   - Explica por qué `showSoftInputOnFocus={false}`
   - Muestra cómo funciona `insertText`

---

## Comandos útiles durante la presentación

```bash
# Ver estructura de carpetas
tree /F  # Windows
tree     # Mac/Linux

# Iniciar la aplicación
npm start

# Ver el código de un archivo
code components/ResultBox.tsx

# Buscar una función en todos los archivos
grep -r "validateLinearEquation" .
```

---

## Preguntas frecuentes que pueden hacer

**Q: ¿Por qué TypeScript y no JavaScript?**
- TypeScript añade tipos que ayudan a encontrar errores antes
- Mejora la experiencia de desarrollo con autocompletado

**Q: ¿Por qué separar en tantas carpetas?**
- Mantiene el código organizado
- Facilita el mantenimiento
- Permite reutilizar funciones

**Q: ¿Cómo funciona mathjs?**
- `evaluate("2x+4", { x: 5 })` reemplaza x con 5 y calcula: 2(5) + 4 = 14
- Permite evaluar expresiones matemáticas dinámicamente

**Q: ¿Por qué usar useState?**
- React necesita saber cuándo actualizar la pantalla
- `useState` notifica a React sobre cambios
- Sin useState, los cambios no se reflejarían visualmente

**Q: ¿Qué hace registerRootComponent?**
- Registra tu componente App como el componente principal
- Expo lo monta en la pantalla cuando se inicia la app

---

¡Éxito en tu presentación! 🚀

