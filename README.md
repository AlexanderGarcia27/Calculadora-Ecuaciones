# Calculadora de Ecuaciones Lineales

Una aplicación React Native que permite resolver ecuaciones lineales simples, visualizar su gráfica y ver el procedimiento paso a paso de la solución.

## 📱 Características

- Resuelve ecuaciones lineales simples (formato: ax + b = c)
- Muestra el procedimiento paso a paso de la solución
- Genera una tabla de valores
- Visualiza la gráfica de la ecuación
- Validación de entrada para asegurar ecuaciones lineales válidas
- Interfaz intuitiva y responsive

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 12 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (para desarrollo Android)
- [Xcode](https://developer.apple.com/xcode/) (para desarrollo iOS, solo Mac)

## 📲 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AlexanderGarcia27/Calculadora-Ecuaciones.git
   cd Calculadora-Ecuaciones-Lineales
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. Ejecuta la aplicación:
   ```bash
   # Para Android
   npm run android
   # o
   yarn android

   # Para iOS
   npm run ios
   # o
   yarn ios
   ```

## 📦 Dependencias Principales

- `react-native`: Framework para desarrollo de aplicaciones móviles
- `mathjs`: Biblioteca para evaluación matemática
- `react-native-chart-kit`: Para la visualización de gráficas

## 🎯 Cómo Usar

1. Ingresa una ecuación lineal en el formato `ax + b = c`
   - Ejemplos válidos:
     - `2x + 4 = 10`
     - `x - 3 = 5`
     - `-3x + 2 = 8`
     - `4x = 12`

2. Presiona "Resolver" para obtener la solución

3. Usa los botones adicionales para:
   - Ver el procedimiento paso a paso
   - Ver la tabla de valores y gráfica
   - Reestablecer la calculadora


## 👥 Autor

Alexander Garcia - [Github](https://github.com/AlexanderGarcia27-github)
