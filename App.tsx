import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getThemeColors } from "./constants/colors";
import { Selection, TableItem } from "./types";
import { validateLinearEquation, validateQuadraticEquation } from "./utils/equationValidation";
import { solveLinearEquation, solveQuadraticEquation } from "./utils/equationSolver";
import { generateLinearProcedure, generateQuadraticProcedure } from "./utils/procedureGenerator";
import ResultBox from "./components/ResultBox";
import EquationTypeSwitch from "./components/EquationTypeSwitch";
import EquationInput from "./components/EquationInput";
import GraphSection from "./components/GraphSection";
import ProcedureSection from "./components/ProcedureSection";
import { commonStyles } from "./styles/styles";

export default function App() {
  const [equation, setEquation] = useState<string>("");
  const [solution, setSolution] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showProcedure, setShowProcedure] = useState<boolean>(false);
  const [procedureSteps, setProcedureSteps] = useState<string[]>([]);
  const [isSecondDegree, setIsSecondDegree] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });

  const solveEquation = (): void => {
    try {
      if (isSecondDegree) {
        solveQuadratic();
      } else {
        solveLinear();
      }
    } catch (error) {
      Alert.alert("Error", "Error al procesar la ecuación. Verifica el formato.");
    }
  };

  const solveLinear = (): void => {
    const [left, right] = equation.split("=");
    if (!left || !right) {
      Alert.alert("Error", "Por favor escribe una ecuación válida (ejemplo: 2x + 4 = 10)");
      return;
    }

    const isValid = validateLinearEquation(equation);
    if (!isValid) {
      Alert.alert(
        "Error",
        "Solo se permiten ecuaciones lineales simples en la forma ax + b = c (por ejemplo: 2x + 4 = 10)"
      );
      return;
    }

    const result = solveLinearEquation(equation);
    if (!result) {
      Alert.alert("Aviso", "No se encontró solución real para esta ecuación.");
      return;
    }

    setSolution(result.solution);
    setTableData(result.tableData);
    const proc = generateLinearProcedure(equation);
    setProcedureSteps(proc);
  };

  const solveQuadratic = (): void => {
    const isValid = validateQuadraticEquation(equation);
    if (!isValid) {
      Alert.alert(
        "Error",
        "Solo se permiten ecuaciones cuadráticas en la forma ax² + bx + c = d (por ejemplo: x² + 2x - 3 = 0 o x² + 2x - 3 = 5)"
      );
      return;
    }

    const result = solveQuadraticEquation(equation);
    if (!result) {
      Alert.alert("Error", "No se pudieron extraer los coeficientes de la ecuación.");
      return;
    }

    setSolution(result.solution);
    setTableData(result.tableData);
    const proc = generateQuadraticProcedure(
      result.coefficients,
      result.discriminant,
      result.coefficients.originalRight
    );
    setProcedureSteps(proc);
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

  const colors = getThemeColors(isSecondDegree);

  return (
    <ScrollView
      style={[commonStyles.container, { backgroundColor: colors.CLR_BACKGROUND }]}
      contentContainerStyle={commonStyles.contentContainer}
    >
      <Text style={[commonStyles.title, { color: colors.CLR_ON_SURFACE }]}>
        Resolver Ecuaciones Lineales
      </Text>

      <EquationTypeSwitch isSecondDegree={isSecondDegree} onToggle={setIsSecondDegree} />

      <ResultBox solution={solution} isSecondDegree={isSecondDegree} />

      <EquationInput
        equation={equation}
        setEquation={setEquation}
        selection={selection}
        setSelection={setSelection}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
        isSecondDegree={isSecondDegree}
      />

      <TouchableOpacity
        onPress={solveEquation}
        style={[commonStyles.button, { backgroundColor: colors.CLR_PRIMARY }]}
        activeOpacity={0.8}
      >
        <Text style={commonStyles.buttonText}>CALCULAR SOLUCIÓN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resetAll}
        style={[commonStyles.button, { backgroundColor: colors.CLR_ACCENT }]}
        activeOpacity={0.8}
      >
        <Text style={commonStyles.buttonText}>REESTABLECER</Text>
      </TouchableOpacity>

      {solution && (
        <TouchableOpacity
          onPress={() => setShowTable(!showTable)}
          style={[commonStyles.button, { backgroundColor: colors.CLR_TOGGLE }]}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.buttonText}>
            {showTable ? "OCULTAR GRÁFICA Y TABLA" : "VER GRÁFICA Y TABLA"}
          </Text>
        </TouchableOpacity>
      )}

      {solution && (
        <TouchableOpacity
          onPress={() => setShowProcedure(!showProcedure)}
          style={[commonStyles.button, { backgroundColor: colors.CLR_PROCEDURE }]}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.buttonText}>
            {showProcedure ? "OCULTAR PROCEDIMIENTO" : "VER PROCEDIMIENTO"}
          </Text>
        </TouchableOpacity>
      )}

      {showTable && <GraphSection tableData={tableData} isSecondDegree={isSecondDegree} />}

      {showProcedure && (
        <ProcedureSection procedureSteps={procedureSteps} isSecondDegree={isSecondDegree} />
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
