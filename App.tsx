import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  ScrollView,
  Switch
} from "react-native";
import { evaluate } from "mathjs";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface TableItem {
  x: number;
  y: string;
}

export default function App() {
  const [equation, setEquation] = useState<string>("");
  const [solution, setSolution] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showProcedure, setShowProcedure] = useState<boolean>(false);
  const [procedureSteps, setProcedureSteps] = useState<string[]>([]);
  const [isSecondDegree, setIsSecondDegree] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);

  const insertText = (text: string): void => {
    const start = selection.start;
    const end = selection.end;
    const newText = equation.substring(0, start) + text + equation.substring(end);
    setEquation(newText);
    const newCursorPosition = start + text.length;
    setSelection({ start: newCursorPosition, end: newCursorPosition });
    // Actualizar el cursor del input
    setTimeout(() => {
      inputRef.current?.setNativeProps({ selection: { start: newCursorPosition, end: newCursorPosition } });
    }, 0);
  };

  const deleteText = (): void => {
    if (selection.start === selection.end && selection.start > 0) {
      // Borrar un carácter antes del cursor
      const newText = equation.substring(0, selection.start - 1) + equation.substring(selection.start);
      setEquation(newText);
      const newCursorPosition = selection.start - 1;
      setSelection({ start: newCursorPosition, end: newCursorPosition });
      setTimeout(() => {
        inputRef.current?.setNativeProps({ selection: { start: newCursorPosition, end: newCursorPosition } });
      }, 0);
    } else if (selection.start !== selection.end) {
      // Borrar la selección
      const newText = equation.substring(0, selection.start) + equation.substring(selection.end);
      setEquation(newText);
      setSelection({ start: selection.start, end: selection.start });
      setTimeout(() => {
        inputRef.current?.setNativeProps({ selection: { start: selection.start, end: selection.start } });
      }, 0);
    }
  };

  const moveCursor = (direction: 'left' | 'right'): void => {
    const newPosition = direction === 'left' 
      ? Math.max(0, selection.start - 1)
      : Math.min(equation.length, selection.start + 1);
    setSelection({ start: newPosition, end: newPosition });
    setTimeout(() => {
      inputRef.current?.setNativeProps({ selection: { start: newPosition, end: newPosition } });
    }, 0);
  };

  const solveEquation = (): void => {
    try {
      if (isSecondDegree) {
        solveQuadraticEquation();
      } else {
        solveLinearEquation();
      }
    } catch (error) {
      Alert.alert("Error", "Error al procesar la ecuación. Verifica el formato.");
    }
  };

  const solveLinearEquation = (): void => {
    const [left, right] = equation.split("=");
    if (!left || !right) {
      Alert.alert("Error", "Por favor escribe una ecuación válida (ejemplo: 2x + 4 = 10)");
      return;
    }

    const isValid = validateLinearEquation(equation);
    if (!isValid) {
      Alert.alert("Error", "Solo se permiten ecuaciones lineales simples en la forma ax + b = c (por ejemplo: 2x + 4 = 10)");
      return;
    }

    const f = (x: number): number => evaluate(left, { x }) - evaluate(right, { x });

    let x = 0;
    let found = false;
    for (let i = -100; i <= 100; i += 0.1) {
      if (Math.abs(f(i)) < 0.001) {
        x = parseFloat(i.toFixed(2));
        found = true;
        break;
      }
    }

    if (!found) {
      Alert.alert("Aviso", "No se encontró solución real para esta ecuación.");
      return;
    }

    const tabla: TableItem[] = [];
    for (let i = -5; i <= 5; i++) {
      const y = evaluate(left, { x: i }).toFixed(2);
      tabla.push({ x: i, y });
    }

    setSolution(x.toString());
    setTableData(tabla);
    const proc = generateProcedure(normalizeEquation(equation));
    setProcedureSteps(proc);
  };

  const solveQuadraticEquation = (): void => {
  const isValid = validateQuadraticEquation(equation);
  if (!isValid) {
    Alert.alert(
      "Error",
      "Solo se permiten ecuaciones cuadráticas en la forma ax² + bx + c = d (por ejemplo: x² + 2x - 3 = 0 o x² + 2x - 3 = 5)"
    );
    return;
  }

  const coefficients = extractQuadraticCoefficients(equation);
  if (!coefficients) {
    Alert.alert("Error", "No se pudieron extraer los coeficientes de la ecuación.");
    return;
  }

  const { a, b, c, originalRight } = coefficients;
  const discriminant = b * b - 4 * a * c;

  let solutions: string[] = [];
  let tabla: TableItem[] = [];

  // 🔹 Caso 1: dos soluciones reales
  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    solutions = [x1.toFixed(2), x2.toFixed(2)];
    setSolution(`x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);

  // 🔹 Caso 2: una solución real doble
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    solutions = [x.toFixed(2)];
    setSolution(`x = ${x.toFixed(2)}`);

  // 🔹 Caso 3: soluciones complejas (discriminante < 0)
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    setSolution(`x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`);
    solutions = [`${realPart}+${imaginaryPart}i`, `${realPart}-${imaginaryPart}i`];
  }

  // 🔹 Generar tabla de valores reales para la gráfica (usar la ecuación original)
  // Para la gráfica, usamos y = ax² + bx + cOriginal donde cOriginal = c + originalRight
  const cOriginal = c + originalRight;
  for (let i = -10; i <= 10; i += 1) {
    const y = (a * i * i + b * i + cOriginal).toFixed(2);
    tabla.push({ x: i, y });
  }

  setTableData(tabla);

  // 🔹 Procedimiento paso a paso
  const proc = generateQuadraticProcedure(coefficients, discriminant, originalRight);
  // Si no hay soluciones reales, agregar pasos complejos al procedimiento
  if (discriminant < 0) {
    proc.push(`Δ < 0: La ecuación no tiene raíces reales.`);
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    proc.push(`Soluciones complejas:`);
    proc.push(`x₁ = ${realPart} + ${imaginaryPart}i`);
    proc.push(`x₂ = ${realPart} - ${imaginaryPart}i`);
  }
  setProcedureSteps(proc);
};


  const normalizeEquation = (eq: string): string => eq.replace(/\s+/g, "");

  const generateProcedure = (eq: string): string[] => {
    try {
      const normalized = eq.replace(/\s+/g, "");
      const [left, right] = normalized.split("=");
      const match = left.match(/^([-+]?\d*\.?\d*)x([+-]\d*\.?\d+)?$/i);
      if (!match) return ["No se pudo generar el procedimiento para este formato."];
      let aStr = match[1];
      const bStr = match[2] || "+0";
      if (aStr === "" || aStr === "+") aStr = "1";
      if (aStr === "-") aStr = "-1";
      const a = parseFloat(aStr);
      const b = parseFloat(bStr);
      const c = parseFloat(right);

      const steps: string[] = [];
      steps.push(`Ecuación inicial: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`);
      const step2Right = c - b;
      steps.push(`Restar ${b} de ambos lados: ${a}x = ${step2Right}`);
      const solution = step2Right / a;
      steps.push(`Dividir ambos lados entre ${a}: x = ${solution}`);
      return steps;
    } catch (e) {
      return ["No se pudo generar el procedimiento."];
    }
  };

  const validateLinearEquation = (eq: string): boolean => {
    if (!eq || typeof eq !== "string") return false;
    const normalized = eq.replace(/\s+/g, "");
    const parts = normalized.split("=");
    if (parts.length !== 2) return false;
    const left = parts[0];
    const right = parts[1];
    if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;
    const leftPattern = /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i;
    return leftPattern.test(left);
  };

  const validateQuadraticEquation = (eq: string): boolean => {
    if (!eq || typeof eq !== "string") return false;
    const normalized = eq.replace(/\s+/g, "");
    const parts = normalized.split("=");
    if (parts.length !== 2) return false;
    const left = parts[0];
    const right = parts[1];
    // Aceptar cualquier número en el lado derecho
    if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;
    const quadraticPattern = /^[-+]?\d*\.?\d*x²([+-]\d*\.?\d*x)?([+-]\d*\.?\d+)?$/i;
    return quadraticPattern.test(left);
  };

  const extractQuadraticCoefficients = (eq: string): { a: number, b: number, c: number, originalRight: number } | null => {
    try {
      const normalized = eq.replace(/\s+/g, "");
      const parts = normalized.split("=");
      const left = parts[0];
      const right = parts[1] || "0";
      
      const aMatch = left.match(/([-+]?\d*\.?\d*)x²/i);
      const bMatch = left.match(/([+-]\d*\.?\d*)x(?!²)/i);
      const cMatch = left.match(/([+-]\d*\.?\d+)(?!x)/);
      
      const a = aMatch ? parseFloat(aMatch[1] || "1") : 0;
      const b = bMatch ? parseFloat(bMatch[1]) : 0;
      const cLeft = cMatch ? parseFloat(cMatch[1]) : 0;
      const rightValue = parseFloat(right);
      
      // Convertir a forma estándar: restar el lado derecho del término constante
      const c = cLeft - rightValue;
      
      return { a, b, c, originalRight: rightValue };
    } catch {
      return null;
    }
  };

  const generateQuadraticProcedure = (coefficients: { a: number, b: number, c: number }, discriminant: number, originalRight: number): string[] => {
    const { a, b, c } = coefficients;
    const steps: string[] = [];
    
    // Mostrar la ecuación original
    const cOriginal = c + originalRight;
    
    // Formatear el término ax²
    let aTerm = '';
    if (a === 1) aTerm = 'x²';
    else if (a === -1) aTerm = '-x²';
    else aTerm = `${a}x²`;
    
    // Formatear el término bx
    let bTerm = '';
    if (b !== 0) {
      const bSign = b >= 0 ? '+' : '-';
      const bAbs = Math.abs(b);
      if (bAbs === 1) bTerm = ` ${bSign} x`;
      else bTerm = ` ${bSign} ${bAbs}x`;
    }
    
    // Formatear el término constante
    let cTerm = '';
    if (cOriginal !== 0) {
      const cSign = cOriginal >= 0 ? '+' : '-';
      const cAbs = Math.abs(cOriginal);
      cTerm = ` ${cSign} ${cAbs}`;
    }
    
    steps.push(`Ecuación inicial: ${aTerm}${bTerm}${cTerm} = ${originalRight}`);
    
    // Si el lado derecho no es 0, mostrar el paso de conversión
    if (originalRight !== 0) {
      // Formatear el término constante después de la conversión
      let cTermConverted = '';
      if (c !== 0) {
        const cSign = c >= 0 ? '+' : '-';
        const cAbs = Math.abs(c);
        cTermConverted = ` ${cSign} ${cAbs}`;
      }
      
      steps.push(`Restar ${originalRight} de ambos lados: ${aTerm}${bTerm}${cTermConverted} = 0`);
    }
    
    steps.push(`Coeficientes: a = ${a}, b = ${b}, c = ${c}`);
    steps.push(`Fórmula cuadrática: x = (-b ± √(b² - 4ac)) / 2a`);
    steps.push(`Discriminante: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);
    
    if (discriminant > 0) {
      steps.push(`Δ > 0: Dos soluciones reales`);
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      steps.push(`x₁ = (-${b} + √${discriminant}) / ${2 * a} = ${x1.toFixed(2)}`);
      steps.push(`x₂ = (-${b} - √${discriminant}) / ${2 * a} = ${x2.toFixed(2)}`);
    } else if (discriminant === 0) {
      steps.push(`Δ = 0: Una solución real`);
      const x = -b / (2 * a);
      steps.push(`x = -${b} / (2 × ${a}) = ${x.toFixed(2)}`);
    } else {
      steps.push(`Δ < 0: No hay soluciones reales`);
    }
    
    return steps;
  };

  const resetAll = (): void => {
    setEquation("");
    setSolution(null);
    setTableData([]);
    setShowTable(false);
    setShowProcedure(false);
    setProcedureSteps([]);
    setShowKeyboard(false);
    setSelection({ start: 0, end: 0 });
  };

  useEffect(() => {
    resetAll();
  }, [isSecondDegree]);

 
  const CLR_LIGHT_PRIMARY = '#00BCD4';
  const CLR_LIGHT_ACCENT = '#FF9800';
  const CLR_LIGHT_TOGGLE = '#00BFA5';
  const CLR_LIGHT_PROCEDURE = '#7B1FA2';

  const CLR_DARK_GRAY_1 = '#8a7d7dff'; 
  const CLR_DARK_GRAY_2 = '#b6b3b3ff'; 
  
  const CLR_PRIMARY = isSecondDegree ? CLR_DARK_GRAY_1 : CLR_LIGHT_PRIMARY; 
  const CLR_ACCENT = isSecondDegree ? CLR_DARK_GRAY_2 : CLR_LIGHT_ACCENT; 
  const CLR_TOGGLE = isSecondDegree ? CLR_DARK_GRAY_1 : CLR_LIGHT_TOGGLE;
  const CLR_PROCEDURE = isSecondDegree ? CLR_DARK_GRAY_2 : CLR_LIGHT_PROCEDURE;
  

  const CLR_SECONDARY = isSecondDegree ? '#03DAC6' : '#4CAF50';
  const CLR_BACKGROUND = isSecondDegree ? '#121212' : '#E0F7FA';
  const CLR_SURFACE = isSecondDegree ? '#1E1E1E' : '#FFF';
  const CLR_ON_SURFACE = isSecondDegree ? '#FFFFFF' : '#333';
  const CLR_BORDER = isSecondDegree ? '#3C3C3C' : '#E0E0E0';
  const CLR_PLACEHOLDER = isSecondDegree ? '#A8A8A8' : '#888';
  const CLR_RESULT_BOX = isSecondDegree ? '#2A2A2A' : '#E8F5E9';
  const CLR_RESULT_BORDER = isSecondDegree ? CLR_SECONDARY : CLR_SECONDARY;
  const CLR_SHADOW = isSecondDegree ? '#000' : '#000';

 
  return (
    <ScrollView 
        style={[styles.container, { backgroundColor: CLR_BACKGROUND }]} 
        contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: CLR_ON_SURFACE }]}>
        Resolver Ecuaciones Lineales
      </Text>

      <View style={[styles.switchContainer, { backgroundColor: CLR_SURFACE, borderColor: CLR_BORDER }]}>
        <Text style={[styles.switchLabel, { color: CLR_ON_SURFACE }]}>Tipo de Ecuación:</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: CLR_PLACEHOLDER }, !isSecondDegree && styles.switchTextActive]}>
            Primer Grado (ax + b = c)
          </Text>
          <Switch
            value={isSecondDegree}
            onValueChange={setIsSecondDegree}
            trackColor={{ false: CLR_LIGHT_PRIMARY, true: CLR_DARK_GRAY_1 }}
            thumbColor={isSecondDegree ? '#fff' : '#fff'}
          />
          <Text style={[styles.switchText, { color: CLR_PLACEHOLDER }, isSecondDegree && styles.switchTextActive]}>
            Segundo Grado (ax² + bx + c = d)
          </Text>
        </View>
      </View>

      <View style={[styles.resultBox, { backgroundColor: CLR_RESULT_BOX, borderColor: CLR_RESULT_BORDER, shadowColor: CLR_SHADOW }]}>
        {solution ? (
          <Text style={[styles.resultTextSolved, { color: CLR_ON_SURFACE }]}>
            Resultado: <Text style={[styles.solutionValue, { color: CLR_SECONDARY }]}>x = {solution}</Text>
          </Text>
        ) : (
          <Text style={[styles.resultTextPlaceholder, { color: CLR_PLACEHOLDER }]}>Aquí aparecerá el resultado...</Text>
        )}
      </View>

      <TextInput
        ref={inputRef}
        placeholder={isSecondDegree ? "Ejemplo: x² + 2x - 3 = 5" : "Ejemplo: 2x + 4 = 10"}
        placeholderTextColor={CLR_PLACEHOLDER}
        value={equation}
        onChangeText={setEquation}
        onSelectionChange={(e) => {
          setSelection({
            start: e.nativeEvent.selection.start,
            end: e.nativeEvent.selection.end,
          });
        }}
        selection={selection}
        style={[styles.input, { borderColor: CLR_BORDER, backgroundColor: CLR_SURFACE, color: CLR_ON_SURFACE }]}
      />

      <TouchableOpacity 
        onPress={() => setShowKeyboard(!showKeyboard)} 
        style={[styles.button, { backgroundColor: CLR_TOGGLE }]} 
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {showKeyboard ? "OCULTAR TECLADO" : "MOSTRAR TECLADO"}
        </Text>
      </TouchableOpacity>

      {showKeyboard && (
        <View style={[styles.keyboardContainer, { backgroundColor: CLR_SURFACE, borderColor: CLR_BORDER }]}>
          {/* Primera fila: Números 1-3 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("1")}>
              <Text style={styles.keyButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("2")}>
              <Text style={styles.keyButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("3")}>
              <Text style={styles.keyButtonText}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_SECONDARY }]} onPress={() => insertText("x")}>
              <Text style={styles.keyButtonText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Segunda fila: Números 4-6 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("4")}>
              <Text style={styles.keyButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("5")}>
              <Text style={styles.keyButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("6")}>
              <Text style={styles.keyButtonText}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_SECONDARY }]} onPress={() => insertText("x²")}>
              <Text style={styles.keyButtonText}>x²</Text>
            </TouchableOpacity>
          </View>

          {/* Tercera fila: Números 7-9 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("7")}>
              <Text style={styles.keyButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("8")}>
              <Text style={styles.keyButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("9")}>
              <Text style={styles.keyButtonText}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_ACCENT }]} onPress={() => insertText("+")}>
              <Text style={styles.keyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Cuarta fila: 0, operadores y controles */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PRIMARY }]} onPress={() => insertText("0")}>
              <Text style={styles.keyButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_ACCENT }]} onPress={() => insertText("-")}>
              <Text style={styles.keyButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_ACCENT }]} onPress={() => insertText("=")}>
              <Text style={styles.keyButtonText}>=</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButton, { backgroundColor: CLR_PROCEDURE }]} onPress={() => insertText(" ")}>
              <Text style={styles.keyButtonText}>␣</Text>
            </TouchableOpacity>
          </View>

          {/* Quinta fila: Controles de cursor y borrar */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={[styles.keyButtonWide, { backgroundColor: CLR_PROCEDURE }]} onPress={() => moveCursor("left")}>
              <Text style={styles.keyButtonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButtonWide, { backgroundColor: CLR_PROCEDURE }]} onPress={() => moveCursor("right")}>
              <Text style={styles.keyButtonText}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.keyButtonWide, { backgroundColor: CLR_ACCENT }]} onPress={deleteText}>
              <Text style={styles.keyButtonText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={solveEquation} style={[styles.button, { backgroundColor: CLR_PRIMARY }]} activeOpacity={0.8}>
        <Text style={styles.buttonText}>CALCULAR SOLUCIÓN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetAll} style={[styles.button, { backgroundColor: CLR_ACCENT }]} activeOpacity={0.8}>
        <Text style={styles.buttonText}>REESTABLECER</Text>
      </TouchableOpacity>

      {solution && (
        <TouchableOpacity onPress={() => setShowTable(!showTable)} style={[styles.button, { backgroundColor: CLR_TOGGLE }]} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {showTable ? "OCULTAR GRÁFICA Y TABLA" : "VER GRÁFICA Y TABLA"}
          </Text>
        </TouchableOpacity>
      )}

      {solution && (
        <TouchableOpacity onPress={() => setShowProcedure(!showProcedure)} style={[styles.button, { backgroundColor: CLR_PROCEDURE }]} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {showProcedure ? "OCULTAR PROCEDIMIENTO" : "VER PROCEDIMIENTO"}
          </Text>
        </TouchableOpacity>
      )}

      {showTable && (
        <View style={[styles.sectionContainer, { backgroundColor: CLR_SURFACE, borderColor: CLR_BORDER }]}>
          <Text style={[styles.sectionTitle, { color: CLR_ON_SURFACE, borderBottomColor: CLR_BORDER }]}>
            Tabla de Valores
          </Text>
          <View style={[styles.tableList, { borderColor: CLR_BORDER }]}>
            {tableData.filter((item, index) => 
              isSecondDegree ? index % 2 === 0 : true
            ).map((item, index) => (
              <View
                key={item.x.toString()}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? [styles.tableRowEven, { backgroundColor: isSecondDegree ? '#2A2A2A' : '#F5F5F5' }] : [styles.tableRowOdd, { backgroundColor: CLR_SURFACE }],
                ]}
              >
                <Text style={[styles.tableText, { color: CLR_ON_SURFACE }]}>x = {item.x}</Text>
                <Text style={[styles.tableText, { color: CLR_ON_SURFACE }]}>y = {item.y}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: CLR_ON_SURFACE, borderBottomColor: CLR_BORDER }]}>
            Gráfica en Plano Cartesiano
          </Text>
           <View style={{ alignItems: 'center' }}>
             <LineChart
               data={{
                 labels: tableData.map((d) => d.x.toString()),
                 datasets: [
                   { data: tableData.map((d) => parseFloat(d.y)) },
                   { data: Array(tableData.length).fill(0), color: () => isSecondDegree ? '#FFFFFF' : "#000" },
                 ],
               }}
               width={screenWidth - 40}
               height={260}
               yAxisSuffix=""
               yAxisInterval={isSecondDegree ? 20 : 1}
               chartConfig={{
                 backgroundGradientFrom: CLR_SURFACE,
                 backgroundGradientTo: CLR_SURFACE,
                 decimalPlaces: 1,
                 color: (opacity = 1) => `rgba(132, 255, 230, ${opacity})`,
                 labelColor: (opacity = 1) => `rgba(${isSecondDegree ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                 propsForDots: {
                   r: "3",
                   strokeWidth: "2",
                   stroke: CLR_ACCENT
                 },
               }}
               bezier={false}
               fromZero={false}
               withInnerLines={true}
               withOuterLines={false}
               style={styles.chart}
             />


            <View
              style={{
                position: 'absolute',
                top: 130,
                width: screenWidth - 40,
                height: 2,
                backgroundColor: isSecondDegree ? '#FFF' : '#000',
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: (screenWidth - 40) / 2,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: isSecondDegree ? '#FFF' : '#000',
              }}
            />
            <View style={[styles.symbolizationBox, { backgroundColor: isSecondDegree ? '#2A2A2A' : '#FFF3E0', borderColor: isSecondDegree ? '#4F4F4F' : '#FFB74D' }]}>
              <Text style={[styles.sectionTitle, { color: CLR_ON_SURFACE, borderBottomColor: CLR_BORDER }]}>
                Simbolización de la Gráfica
              </Text>
              <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Eje X (horizontal): representa los valores de x.</Text>
              {isSecondDegree ? (
                <>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Eje Y (vertical): representa los valores de y = f(x) = ax² + bx + c.</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Línea turquesa: la parábola de la ecuación cuadrática.</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Cruce con el eje X: soluciones de la ecuación (x donde y = 0).</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Puntos: valores calculados para ver la forma de la parábola.</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Eje Y (vertical): representa los valores de y = f(x) = ax + b.</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Línea azul: la recta de la ecuación lineal.</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Cruce con el eje X: solución de la ecuación (x donde y = 0).</Text>
                  <Text style={[styles.symbolText, { color: CLR_ON_SURFACE }]}>• Puntos: valores calculados para ver la pendiente de la recta.</Text>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {showProcedure && (
        <View style={[styles.procedureBox, { backgroundColor: isSecondDegree ? '#2A2A2A' : '#FFFDE7', borderColor: isSecondDegree ? '#4F4F4F' : '#FFECB3' }]}>
          <Text style={[styles.sectionTitle, { color: CLR_ON_SURFACE, borderBottomColor: CLR_BORDER }]}>
            Pasos de la Solución
          </Text>
          {procedureSteps.map((step, idx) => (
            <Text key={idx} style={[styles.procedureStep, { color: CLR_ON_SURFACE }]}>{idx + 1}. {step}</Text>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  resultBox: {
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    marginBottom: 15,
    borderLeftWidth: 5,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTextPlaceholder: {
    fontSize: 16,
  },
  resultTextSolved: {
    fontSize: 17,
    fontWeight: '600',
  },
  solutionValue: {
    fontWeight: '900',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: '700',
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  tableList: {
    maxHeight: 180,
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tableRowEven: { 
  },
  tableRowOdd: { 
  },
  tableText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  procedureBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  procedureStep: {
    marginBottom: 6,
    fontSize: 15,
    lineHeight: 22,
  },
  symbolizationBox: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  symbolText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  switchContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchText: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  switchTextActive: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  keyboardContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keyButton: {
    flex: 1,
    height: 50,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  keyButtonWide: {
    flex: 2,
    height: 50,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  keyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  }
});