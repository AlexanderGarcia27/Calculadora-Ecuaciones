import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getThemeColors } from "../constants/colors";

interface ProcedureSectionProps {
  procedureSteps: string[];
  isSecondDegree: boolean;
}

export default function ProcedureSection({
  procedureSteps,
  isSecondDegree,
}: ProcedureSectionProps) {
  const colors = getThemeColors(isSecondDegree);

  return (
    <View
      style={[
        styles.procedureBox,
        {
          backgroundColor: isSecondDegree ? "#2A2A2A" : "#FFFDE7",
          borderColor: isSecondDegree ? "#4F4F4F" : "#FFECB3",
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.CLR_ON_SURFACE, borderBottomColor: colors.CLR_BORDER },
        ]}
      >
        Pasos de la Solución
      </Text>
      {procedureSteps.map((step, idx) => (
        <Text key={idx} style={[styles.procedureStep, { color: colors.CLR_ON_SURFACE }]}>
          {idx + 1}. {step}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  procedureBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  procedureStep: {
    marginBottom: 6,
    fontSize: 15,
    lineHeight: 22,
  },
});


