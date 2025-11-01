import { StyleSheet } from "react-native";

export const graphSectionStyles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  tableList: {
    maxHeight: 180,
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tableRowEven: {},
  tableRowOdd: {},
  tableText: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  symbolizationBox: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  symbolText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});

