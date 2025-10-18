import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  StyleSheet,
  ScrollView
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

  const solveEquation = (): void => {
    try {
      const [left, right] = equation.split("=");
      if (!left || !right) {
        Alert.alert("Error", "Por favor escribe una ecuación válida (ejemplo: 2x + 4 = 10)");
        return;
      }

      // Validar que la ecuación sea lineal simple (ax + b = c o x + b = c)
      const isValid = validateLinearEquation(equation);
      if (!isValid) {
        Alert.alert("Error", "Solo se permiten ecuaciones lineales simples en la forma ax + b = c (por ejemplo: 2x + 4 = 10)");
        return;
      }

      // Definir f(x) = left - right
      const f = (x: number): number => evaluate(left, { x }) - evaluate(right, { x });

      // Buscar solución simple (x donde f(x)=0)
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

      // Crear tabla de valores
      const tabla: TableItem[] = [];
      for (let i = -5; i <= 5; i++) {
        const y = evaluate(left, { x: i }).toFixed(2);
        tabla.push({ x: i, y });
      }

      setSolution(x.toString());
      setTableData(tabla);
      
      // Generar procedimiento simple para ecuación lineal ax + b = c
      const proc = generateProcedure(normalizeEquation(equation));
      setProcedureSteps(proc);
    } catch (error) {
      Alert.alert("Error", "Error al procesar la ecuación. Intenta con algo como: 2x + 4 = 10");
    }
  };

  // Normaliza espacios y asegura formato estándar "ax+b=c"
  const normalizeEquation = (eq: string): string => eq.replace(/\s+/g, "");

  // Genera pasos simples para una ecuación lineal ax + b = c
  const generateProcedure = (eq: string): string[] => {
    try {
      const normalized = eq.replace(/\s+/g, "");
      const [left, right] = normalized.split("=");
      // extraer coeficiente y termino independiente del lado izquierdo
      // left puede ser como '2x+4', '-3x-2', 'x+4', '4x', 'x'
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
      // Paso: restar b de ambos lados
      const step2Right = c - b;
      steps.push(`Restar ${b} de ambos lados: ${a}x = ${step2Right}`);
      // Paso: dividir por a
      const solution = step2Right / a;
      steps.push(`Dividir ambos lados entre ${a}: x = ${solution}`);
      return steps;
    } catch (e) {
      return ["No se pudo generar el procedimiento."];
    }
  };

  // Valida ecuaciones lineales simples: ax + b = c, con espacios opcionales
  const validateLinearEquation = (eq: string): boolean => {
    if (!eq || typeof eq !== "string") return false;
    // Normalizar espacios
    const normalized = eq.replace(/\s+/g, "");
    // Separar en lados
    const parts = normalized.split("=");
    if (parts.length !== 2) return false;
    const left = parts[0];
    const right = parts[1];

    // Right side debe ser un número (posible con signo y decimales)
    if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;

    // Left side debe ser de la forma ax+b, ax-b, x+b, -x+b, etc.
    // Permitir coeficiente opcional (número) seguido de 'x', y opcionalmente + or - y número
    // Ejemplos válidos: 2x+4, x-3, -3x+2, 4x, x
    const leftPattern = /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i;
    return leftPattern.test(left);
  };

  // Limpiar input y resultado
  const resetAll = (): void => {
    setEquation("");
    setSolution(null);
    setTableData([]);
    setShowTable(false);
    setShowProcedure(false); 
    setProcedureSteps([]); 
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Título */}
      <Text style={styles.title}>
        Resolver Ecuaciones Lineales 💡
      </Text>

      {/* Contenedor del resultado */}
      <View style={styles.resultBox}>
        {solution ? (
          <Text style={styles.resultTextSolved}>
            ✅ Resultado: <Text style={styles.solutionValue}>x = {solution}</Text>
          </Text>
        ) : (
          <Text style={styles.resultTextPlaceholder}>
            Aquí aparecerá el resultado...
          </Text>
        )}
      </View>

      {/* Input */}
      <TextInput
        placeholder="Ejemplo: 2x + 4 = 10"
        placeholderTextColor="#888"
        value={equation}
        onChangeText={setEquation}
        style={styles.input}
      />

      {/* Botón resolver */}
      <TouchableOpacity
        onPress={solveEquation}
        style={[styles.button, styles.solveButton]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>CALCULAR SOLUCIÓN</Text>
      </TouchableOpacity>

      {/* Botón reestablecer */}
      <TouchableOpacity
        onPress={resetAll}
        style={[styles.button, styles.resetButton]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>REESTABLECER </Text>
      </TouchableOpacity>

      {/* Botón ver tabla y gráfica */}
      {solution && (
        <TouchableOpacity
          onPress={() => setShowTable(!showTable)}
          style={[styles.button, styles.toggleButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {showTable ? "OCULTAR GRÁFICA Y TABLA 📉" : "VER GRÁFICA Y TABLA 📈"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Botón ver procedimiento */}
      {solution && (
        <TouchableOpacity
          onPress={() => setShowProcedure(!showProcedure)}
          style={[styles.button, styles.procedureButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {showProcedure ? "OCULTAR PROCEDIMIENTO 📝" : "VER PROCEDIMIENTO 🧠"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Tabla y gráfica */}
      {showTable && (
          <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tabla de Valores</Text>
          <View style={styles.tableList}> 
            {tableData.map((item, index) => (
              <View 
                key={item.x.toString()} 
                style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
              >
                <Text style={styles.tableText}>$x = {item.x}$</Text>
                <Text style={styles.tableText}>$y = {item.y}$</Text>
              </View>
            ))}
          </View>
          {/* Fin del cambio */}

          <Text style={styles.sectionTitle}>Gráfica de la Función</Text>
          <LineChart
            data={{
              labels: tableData.map((d) => d.x.toString()),
              datasets: [{ data: tableData.map((d) => parseFloat(d.y)) }],
            }}
            width={screenWidth - 50} 
            height={220}
            chartConfig={{
              backgroundColor: "#2E3A46",
              backgroundGradientFrom: "#34495E",
              backgroundGradientTo: "#2C3E50",
              color: (opacity = 1) => `rgba(0, 191, 165, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
              decimalPlaces: 1,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#FFC107"
              }
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Procedimiento paso a paso */}
      {showProcedure && (
        <View style={styles.procedureBox}>
          <Text style={styles.sectionTitle}>Pasos de la Solución 🪜</Text>
          {procedureSteps.map((step, idx) => (
            <Text key={idx} style={styles.procedureStep}>{idx + 1}. {step}</Text>
          ))}
        </View>
      )}
      {/* Añadir espacio al final para asegurar que el último contenido no quede pegado al borde */}
      <View style={{height: 30}} />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
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
  solveButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  resetButton: {
    backgroundColor: ACCENT_COLOR, 
  },
  toggleButton: {
    backgroundColor: '#00BFA5', 
  },
  procedureButton: {
    backgroundColor: '#7B1FA2', 
  },
 
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
    marginTop: 10,
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
  tableRowEven: {
    backgroundColor: '#F5F5F5', 
  },
  tableRowOdd: {
    backgroundColor: '#FFF', 
  },
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
  }
});