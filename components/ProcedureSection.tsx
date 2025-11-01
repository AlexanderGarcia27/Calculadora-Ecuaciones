import React from "react";
import { View, Text } from "react-native";
import { getThemeColors } from "../constants/colors";
import { procedureSectionStyles } from "../styles/ProcedureSection.styles";

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
        procedureSectionStyles.procedureBox,
        {
          backgroundColor: isSecondDegree ? "#2A2A2A" : "#FFFDE7",
          borderColor: isSecondDegree ? "#4F4F4F" : "#FFECB3",
        },
      ]}
    >
      <Text
        style={[
          procedureSectionStyles.sectionTitle,
          { color: colors.CLR_ON_SURFACE, borderBottomColor: colors.CLR_BORDER },
        ]}
      >
        Pasos de la Solución
      </Text>
      {procedureSteps.map((step, idx) => (
        <Text key={idx} style={[procedureSectionStyles.procedureStep, { color: colors.CLR_ON_SURFACE }]}>
          {idx + 1}. {step}
        </Text>
      ))}
    </View>
  );
}


