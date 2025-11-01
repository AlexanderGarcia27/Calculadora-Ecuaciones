import { StyleSheet } from "react-native";

export const equationTypeSwitchStyles = StyleSheet.create({
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

