import { StyleSheet } from "react-native";

export const resultBoxStyles = StyleSheet.create({
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

