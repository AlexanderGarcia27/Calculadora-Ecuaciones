import React from "react";
import { View, Text, Switch } from "react-native";
import { getThemeColors } from "../constants/colors";
import { equationTypeSwitchStyles } from "../styles/EquationTypeSwitch.styles";

interface EquationTypeSwitchProps {
  isSecondDegree: boolean;
  onToggle: (value: boolean) => void;
}

export default function EquationTypeSwitch({
  isSecondDegree,
  onToggle,
}: EquationTypeSwitchProps) {
  const colors = getThemeColors(isSecondDegree);
  const CLR_LIGHT_PRIMARY = '#00BCD4';
  const CLR_DARK_GRAY_1 = '#8a7d7dff';

  return (
    <View
      style={[
        equationTypeSwitchStyles.switchContainer,
        { backgroundColor: colors.CLR_SURFACE, borderColor: colors.CLR_BORDER },
      ]}
    >
      <Text style={[equationTypeSwitchStyles.switchLabel, { color: colors.CLR_ON_SURFACE }]}>
        Tipo de Ecuación:
      </Text>
      <View style={equationTypeSwitchStyles.switchRow}>
        <Text
          style={[
            equationTypeSwitchStyles.switchText,
            { color: colors.CLR_PLACEHOLDER },
            !isSecondDegree && equationTypeSwitchStyles.switchTextActive,
          ]}
        >
          Primer Grado (ax + b = c)
        </Text>
        <Switch
          value={isSecondDegree}
          onValueChange={onToggle}
          trackColor={{ false: CLR_LIGHT_PRIMARY, true: CLR_DARK_GRAY_1 }}
          thumbColor="#fff"
        />
        <Text
          style={[
            equationTypeSwitchStyles.switchText,
            { color: colors.CLR_PLACEHOLDER },
            isSecondDegree && equationTypeSwitchStyles.switchTextActive,
          ]}
        >
          Segundo Grado (ax² + bx + c = d)
        </Text>
      </View>
    </View>
  );
}


