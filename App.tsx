import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Dimensions, Alert } from "react-native";
import { evaluate } from "mathjs";
import { LineChart } from "react-native-chart-kit";

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
      setShowTable(false);
      // Generar procedimiento simple para ecuación lineal ax + b = c
      const proc = generateProcedure(normalizeEquation(equation));
      setProcedureSteps(proc);
      setShowProcedure(false);
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
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Título */}
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        Resolver ecuaciones lineales simples
      </Text>

      {/* Contenedor del resultado */}
      <View style={{ borderWidth: 1, borderColor: "#aaa", padding: 10, minHeight: 50, marginBottom: 10 }}>
        {solution ? <Text>Resultado: x = {solution}</Text> : <Text>Aquí aparecerá el resultado...</Text>}
      </View>

      {/* Input */}
      <TextInput
        placeholder="Ejemplo: 2x + 4 = 10"
        value={equation}
        onChangeText={setEquation}
        style={{ borderWidth: 1, borderColor: "#aaa", padding: 10, marginBottom: 10 }}
      />

      {/* Botón resolver */}
      <TouchableOpacity
        onPress={solveEquation}
        style={{ backgroundColor: "#00796B", padding: 10, alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ color: "#fff" }}>Resolver</Text>
      </TouchableOpacity>

      {/* Botón reestablecer */}
      <TouchableOpacity
        onPress={resetAll}
        style={{ backgroundColor: "#9E9E9E", padding: 10, alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ color: "#fff" }}>Reestablecer</Text>
      </TouchableOpacity>

      {/* Botón ver tabla y gráfica */}
      {solution && (
        <TouchableOpacity
          onPress={() => setShowTable(!showTable)}
          style={{ backgroundColor: "#0288D1", padding: 10, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "#fff" }}>
            {showTable ? "Ocultar tabla y gráfica" : "Ver tabla y gráfica"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Botón ver procedimiento */}
      {solution && (
        <TouchableOpacity
          onPress={() => setShowProcedure(!showProcedure)}
          style={{ backgroundColor: "#6A1B9A", padding: 10, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "#fff" }}>
            {showProcedure ? "Ocultar procedimiento" : "Ver procedimiento"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Tabla y gráfica */}
      {showTable && (
        <View>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Tabla de valores</Text>
          <FlatList
            data={tableData}
            keyExtractor={(item) => item.x.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>x = {item.x}</Text>
                <Text>y = {item.y}</Text>
              </View>
            )}
          />

          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Gráfica</Text>
          <LineChart
            data={{
              labels: tableData.map((d) => d.x.toString()),
              datasets: [{ data: tableData.map((d) => parseFloat(d.y)) }],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#e0f7fa",
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
              decimalPlaces: 2,
            }}
            style={{ marginVertical: 10 }}
          />
        </View>
      )}

      {/* Procedimiento paso a paso */}
      {showProcedure && (
        <View style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ddd' }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Procedimiento</Text>
          {procedureSteps.map((step, idx) => (
            <Text key={idx} style={{ marginBottom: 4 }}>{idx + 1}. {step}</Text>
          ))}
        </View>
      )}
    </View>
  );
}
