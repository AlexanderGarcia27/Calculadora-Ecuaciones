import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});


