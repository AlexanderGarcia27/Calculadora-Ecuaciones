import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getThemeColors } from "../constants/colors";

interface ResultBoxProps {
  solution: string | null;
  isSecondDegree: boolean;
}

export default function ResultBox({ solution, isSecondDegree }: ResultBoxProps) {
  const colors = getThemeColors(isSecondDegree);

  return (
    <View
      style={[
        styles.resultBox,
        {
          backgroundColor: colors.CLR_RESULT_BOX,
          borderColor: colors.CLR_RESULT_BORDER,
          shadowColor: colors.CLR_SHADOW,
        },
      ]}
    >
      {solution ? (
        <Text style={[styles.resultTextSolved, { color: colors.CLR_ON_SURFACE }]}>
          Resultado:{" "}
          <Text style={[styles.solutionValue, { color: colors.CLR_SECONDARY }]}>
            x = {solution}
          </Text>
        </Text>
      ) : (
        <Text style={[styles.resultTextPlaceholder, { color: colors.CLR_PLACEHOLDER }]}>
          Aquí aparecerá el resultado...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    marginBottom: 15,
    borderLeftWidth: 5,
    justifyContent: "center",
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
    fontWeight: "600",
  },
  solutionValue: {
    fontWeight: "900",
    fontSize: 18,
  },
});


