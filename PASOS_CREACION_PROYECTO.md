# 📋 Pasos para Crear el Proyecto desde Cero

## Paso 1: Instalación Inicial

```bash
# 1. Instalar Expo CLI globalmente
npm install -g expo-cli

# 2. Crear proyecto nuevo
npx create-expo-app Calculadora-Ecuaciones-Lineales --template blank-typescript

# 3. Entrar a la carpeta
cd Calculadora-Ecuaciones-Lineales

# 4. Instalar dependencias adicionales
npm install mathjs react-native-chart-kit react-native-svg
```

---

## Paso 2: Crear Estructura de Carpetas

Crea estas carpetas (en orden):

```
📁 types/
📁 constants/
📁 utils/
📁 components/
📁 styles/
```

---

## Paso 3: Crear Archivos Base - Primero

### 1. `types/index.ts`
Crear primero este archivo.

### 2. `constants/colors.ts`
Crear segundo.

### 3. `styles/styles.ts`
Crear tercero.

---

## Paso 4: Crear Utilidades - Segundo

### 4. `utils/equationValidation.ts`
### 5. `utils/equationSolver.ts`
### 6. `utils/procedureGenerator.ts`

**Nota:** Crear en este orden porque `equationSolver.ts` usa tipos de `types/index.ts`.

---

## Paso 5: Crear Componentes - Tercero

### 7. `components/ResultBox.tsx`
### 8. `components/EquationTypeSwitch.tsx`
### 9. `components/EquationInput.tsx`
### 10. `components/GraphSection.tsx`
### 11. `components/ProcedureSection.tsx`

**Nota:** Crear `ResultBox.tsx` primero porque es el más simple.

---

## Paso 6: Archivos Principales - Último

### 12. `App.tsx`
Crear o actualizar este archivo al final porque usa todos los demás.

### 13. `index.ts`
Verificar que existe (ya viene con el template).

---

## Resumen del Orden

1. ✅ `types/index.ts`
2. ✅ `constants/colors.ts`
3. ✅ `styles/styles.ts`
4. ✅ `utils/equationValidation.ts`
5. ✅ `utils/equationSolver.ts`
6. ✅ `utils/procedureGenerator.ts`
7. ✅ `components/ResultBox.tsx`
8. ✅ `components/EquationTypeSwitch.tsx`
9. ✅ `components/EquationInput.tsx`
10. ✅ `components/GraphSection.tsx`
11. ✅ `components/ProcedureSection.tsx`
12. ✅ `App.tsx`
13. ✅ `index.ts` (verificar)

---

## Comando para Probar

```bash
npm start
```

---

**¡Listo! Sigue este orden y todo funcionará correctamente.**

