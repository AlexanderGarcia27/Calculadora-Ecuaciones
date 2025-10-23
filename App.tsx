import React, { useState } from "react";
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
      Alert.alert("Error", "Solo se permiten ecuaciones cuadráticas en la forma ax² + bx + c = 0 (por ejemplo: x² + 2x - 3 = 0)");
      return;
    }

    // Extraer coeficientes a, b, c de ax² + bx + c = 0
    const coefficients = extractQuadraticCoefficients(equation);
    if (!coefficients) {
      Alert.alert("Error", "No se pudieron extraer los coeficientes de la ecuación.");
      return;
    }

    const { a, b, c } = coefficients;
    
    // Calcular discriminante
    const discriminant = b * b - 4 * a * c;
    
    let solutions: string[] = [];
    let tabla: TableItem[] = [];
    
    if (discriminant > 0) {
      // Dos soluciones reales
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      solutions = [x1.toFixed(2), x2.toFixed(2)];
      setSolution(`x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);
    } else if (discriminant === 0) {
      // Una solución real
      const x = -b / (2 * a);
      solutions = [x.toFixed(2)];
      setSolution(`x = ${x.toFixed(2)}`);
    } else {
      // Sin soluciones reales
      Alert.alert("Aviso", "Esta ecuación cuadrática no tiene soluciones reales.");
      return;
    }

    // Crear tabla de valores para la parábola con menor densidad
    for (let i = -10; i <= 10; i += 1) {
      const y = (a * i * i + b * i + c).toFixed(2);
      tabla.push({ x: i, y });
    }

    setTableData(tabla);
    const proc = generateQuadraticProcedure(coefficients, discriminant);
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
    if (right !== "0") return false;
    // Validar formato ax² + bx + c = 0
    const quadraticPattern = /^[-+]?\d*\.?\d*x²([+-]\d*\.?\d*x)?([+-]\d*\.?\d+)?$/i;
    return quadraticPattern.test(left);
  };

  const extractQuadraticCoefficients = (eq: string): { a: number, b: number, c: number } | null => {
    try {
      const normalized = eq.replace(/\s+/g, "");
      const left = normalized.split("=")[0];
      
      // Patrones para extraer coeficientes
      const aMatch = left.match(/([-+]?\d*\.?\d*)x²/i);
      const bMatch = left.match(/([+-]\d*\.?\d*)x(?!²)/i);
      const cMatch = left.match(/([+-]\d*\.?\d+)(?!x)/);
      
      const a = aMatch ? parseFloat(aMatch[1] || "1") : 0;
      const b = bMatch ? parseFloat(bMatch[1]) : 0;
      const c = cMatch ? parseFloat(cMatch[1]) : 0;
      
      return { a, b, c };
    } catch {
      return null;
    }
  };

  const generateQuadraticProcedure = (coefficients: { a: number, b: number, c: number }, discriminant: number): string[] => {
    const { a, b, c } = coefficients;
    const steps: string[] = [];
    
    steps.push(`Ecuación inicial: ${a}x² + ${b}x + ${c} = 0`);
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
    setIsSecondDegree(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Resolver Ecuaciones Lineales</Text>

      {/* Switch para alternar tipo de ecuación */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Tipo de Ecuación:</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, !isSecondDegree && styles.switchTextActive]}>
            Primer Grado (ax + b = c)
          </Text>
          <Switch
            value={isSecondDegree}
            onValueChange={setIsSecondDegree}
            trackColor={{ false: '#81c784', true: '#ff9800' }}
            thumbColor={isSecondDegree ? '#fff' : '#fff'}
          />
          <Text style={[styles.switchText, isSecondDegree && styles.switchTextActive]}>
            Segundo Grado (ax² + bx + c = 0)
          </Text>
        </View>
      </View>

      <View style={styles.resultBox}>
        {solution ? (
          <Text style={styles.resultTextSolved}>
            Resultado: <Text style={styles.solutionValue}>x = {solution}</Text>
          </Text>
        ) : (
          <Text style={styles.resultTextPlaceholder}>Aquí aparecerá el resultado...</Text>
        )}
      </View>

      <TextInput
        placeholder={isSecondDegree ? "Ejemplo: x² + 2x - 3 = 0" : "Ejemplo: 2x + 4 = 10"}
        placeholderTextColor="#888"
        value={equation}
        onChangeText={setEquation}
        style={styles.input}
      />

      <TouchableOpacity onPress={solveEquation} style={[styles.button, styles.solveButton]} activeOpacity={0.8}>
        <Text style={styles.buttonText}>CALCULAR SOLUCIÓN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetAll} style={[styles.button, styles.resetButton]} activeOpacity={0.8}>
        <Text style={styles.buttonText}>REESTABLECER</Text>
      </TouchableOpacity>

      {solution && (
        <TouchableOpacity onPress={() => setShowTable(!showTable)} style={[styles.button, styles.toggleButton]} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {showTable ? "OCULTAR GRÁFICA Y TABLA" : "VER GRÁFICA Y TABLA"}
          </Text>
        </TouchableOpacity>
      )}

      {solution && (
        <TouchableOpacity onPress={() => setShowProcedure(!showProcedure)} style={[styles.button, styles.procedureButton]} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {showProcedure ? "OCULTAR PROCEDIMIENTO" : "VER PROCEDIMIENTO"}
          </Text>
        </TouchableOpacity>
      )}

      {showTable && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tabla de Valores</Text>
          <View style={styles.tableList}>
            {tableData.filter((item, index) => 
              isSecondDegree ? index % 2 === 0 : true
            ).map((item, index) => (
              <View
                key={item.x.toString()}
                style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
              >
                <Text style={styles.tableText}>x = {item.x}</Text>
                <Text style={styles.tableText}>y = {item.y}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Gráfica en Plano Cartesiano</Text>
           <View style={{ alignItems: 'center' }}>
             <LineChart
               data={{
                 labels: tableData.map((d) => d.x.toString()),
                 datasets: [
                   { data: tableData.map((d) => parseFloat(d.y)) },
                   { data: Array(tableData.length).fill(0), color: () => "#000" }, // Eje X
                 ],
               }}
               width={screenWidth - 40}
               height={260}
               yAxisSuffix=""
               yAxisInterval={isSecondDegree ? 20 : 1}
               chartConfig={{
                 backgroundGradientFrom: "#FFFFFF",
                 backgroundGradientTo: "#FFFFFF",
                 decimalPlaces: 1,
                 color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                 labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                 propsForDots: {
                   r: "3",
                   strokeWidth: "2",
                   stroke: "#FF5722"
                 },
               }}
               bezier={false}
               fromZero={false}
               withInnerLines={true}
               withOuterLines={false}
               style={styles.chart}
             />


            {/* Ejes X y Y simulados */}
            <View
              style={{
                position: 'absolute',
                top: 130,
                width: screenWidth - 40,
                height: 2,
                backgroundColor: '#000',
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: (screenWidth - 40) / 2,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#000',
              }}
            />
            {/* Explicación simbólica */}
            <View style={styles.symbolizationBox}>
              <Text style={styles.sectionTitle}>Simbolización de la Gráfica</Text>
              <Text style={styles.symbolText}>• Eje X (horizontal): representa los valores de x.</Text>
              {isSecondDegree ? (
                <>
                  <Text style={styles.symbolText}>• Eje Y (vertical): representa los valores de y = f(x) = ax² + bx + c.</Text>
                  <Text style={styles.symbolText}>• Línea azul: la parábola de la ecuación cuadrática.</Text>
                  <Text style={styles.symbolText}>• Cruce con el eje X: soluciones de la ecuación (x donde y = 0).</Text>
                  <Text style={styles.symbolText}>• Puntos: valores calculados para ver la forma de la parábola.</Text>
                </>
              ) : (
                <>
                  <Text style={styles.symbolText}>• Eje Y (vertical): representa los valores de y = f(x) = ax + b.</Text>
                  <Text style={styles.symbolText}>• Línea azul: la recta de la ecuación lineal.</Text>
                  <Text style={styles.symbolText}>• Cruce con el eje X: solución de la ecuación (x donde y = 0).</Text>
                  <Text style={styles.symbolText}>• Puntos: valores calculados para ver la pendiente de la recta.</Text>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {showProcedure && (
        <View style={styles.procedureBox}>
          <Text style={styles.sectionTitle}>Pasos de la Solución</Text>
          {procedureSteps.map((step, idx) => (
            <Text key={idx} style={styles.procedureStep}>{idx + 1}. {step}</Text>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const PRIMARY_COLOR = '#00BCD4';
const SECONDARY_COLOR = '#4CAF50';
const ACCENT_COLOR = '#FF9800';
const BACKGROUND_COLOR = '#E0F7FA';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
  },
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
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderColor: SECONDARY_COLOR,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTextPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  resultTextSolved: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  solutionValue: {
    color: SECONDARY_COLOR,
    fontWeight: '900',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
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
  solveButton: { backgroundColor: PRIMARY_COLOR },
  resetButton: { backgroundColor: ACCENT_COLOR },
  toggleButton: { backgroundColor: '#00BFA5' },
  procedureButton: { backgroundColor: '#7B1FA2' },
  sectionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 5,
  },
  tableList: {
    maxHeight: 180,
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tableRowEven: { backgroundColor: '#F5F5F5' },
  tableRowOdd: { backgroundColor: '#FFF' },
  tableText: {
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#FFECB3',
    borderRadius: 10,
  },
  procedureStep: {
    marginBottom: 6,
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  symbolizationBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  symbolText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 4,
  },
  switchContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  switchTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  }
  
});
