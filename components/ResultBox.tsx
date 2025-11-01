import React from "react";
import { View, Text } from "react-native";
import { getThemeColors } from "../constants/colors";
import { resultBoxStyles } from "../styles/ResultBox.styles";

interface ResultBoxProps {
  solution: string | null;
  isSecondDegree: boolean;
}

export default function ResultBox({ solution, isSecondDegree }: ResultBoxProps) {
  const colors = getThemeColors(isSecondDegree);

  return (
    <View
      style={[
        resultBoxStyles.resultBox,
        {
          backgroundColor: colors.CLR_RESULT_BOX,
          borderColor: colors.CLR_RESULT_BORDER,
          shadowColor: colors.CLR_SHADOW,
        },
      ]}
    >
      {solution ? (
        <Text style={[resultBoxStyles.resultTextSolved, { color: colors.CLR_ON_SURFACE }]}>
          Resultado:{" "}
          <Text style={[resultBoxStyles.solutionValue, { color: colors.CLR_SECONDARY }]}>
            x = {solution}
          </Text>
        </Text>
      ) : (
        <Text style={[resultBoxStyles.resultTextPlaceholder, { color: colors.CLR_PLACEHOLDER }]}>
          Aquí aparecerá el resultado...
        </Text>
      )}
    </View>
  );
}


