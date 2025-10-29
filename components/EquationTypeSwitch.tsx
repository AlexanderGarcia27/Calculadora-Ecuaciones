import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { getThemeColors } from "../constants/colors";

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
        styles.switchContainer,
        { backgroundColor: colors.CLR_SURFACE, borderColor: colors.CLR_BORDER },
      ]}
    >
      <Text style={[styles.switchLabel, { color: colors.CLR_ON_SURFACE }]}>
        Tipo de Ecuación:
      </Text>
      <View style={styles.switchRow}>
        <Text
          style={[
            styles.switchText,
            { color: colors.CLR_PLACEHOLDER },
            !isSecondDegree && styles.switchTextActive,
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
            styles.switchText,
            { color: colors.CLR_PLACEHOLDER },
            isSecondDegree && styles.switchTextActive,
          ]}
        >
          Segundo Grado (ax² + bx + c = d)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchText: {
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  switchTextActive: {
    color: "#00BCD4",
    fontWeight: "600",
  },
});


