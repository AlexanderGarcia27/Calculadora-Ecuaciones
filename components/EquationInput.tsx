import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Selection } from "../types";
import { getThemeColors } from "../constants/colors";

interface EquationInputProps {
  equation: string;
  setEquation: (text: string) => void;
  selection: Selection;
  setSelection: (selection: Selection) => void;
  showKeyboard: boolean;
  setShowKeyboard: (show: boolean) => void;
  isSecondDegree: boolean;
}

export default function EquationInput({
  equation,
  setEquation,
  selection,
  setSelection,
  showKeyboard,
  setShowKeyboard,
  isSecondDegree,
}: EquationInputProps) {
  const inputRef = useRef<TextInput>(null);
  const colors = getThemeColors(isSecondDegree);

  const insertText = (text: string): void => {
    const start = selection.start;
    const end = selection.end;
    const newText = equation.substring(0, start) + text + equation.substring(end);
    setEquation(newText);
    const newCursorPosition = start + text.length;
    setSelection({ start: newCursorPosition, end: newCursorPosition });
    setTimeout(() => {
      inputRef.current?.setNativeProps({
        selection: { start: newCursorPosition, end: newCursorPosition },
      });
    }, 0);
  };

  const deleteText = (): void => {
    if (selection.start === selection.end && selection.start > 0) {
      const newText =
        equation.substring(0, selection.start - 1) +
        equation.substring(selection.start);
      setEquation(newText);
      const newCursorPosition = selection.start - 1;
      setSelection({ start: newCursorPosition, end: newCursorPosition });
      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: newCursorPosition, end: newCursorPosition },
        });
      }, 0);
    } else if (selection.start !== selection.end) {
      const newText =
        equation.substring(0, selection.start) + equation.substring(selection.end);
      setEquation(newText);
      setSelection({ start: selection.start, end: selection.start });
      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: selection.start, end: selection.start },
        });
      }, 0);
    }
  };

  const moveCursor = (direction: "left" | "right"): void => {
    const newPosition =
      direction === "left"
        ? Math.max(0, selection.start - 1)
        : Math.min(equation.length, selection.start + 1);
    setSelection({ start: newPosition, end: newPosition });
    setTimeout(() => {
      inputRef.current?.setNativeProps({
        selection: { start: newPosition, end: newPosition },
      });
    }, 0);
  };

  const handleFocus = () => {
    // Abrir automáticamente el teclado personalizado cuando se enfoca el input
    if (!showKeyboard) {
      setShowKeyboard(true);
    }
    // Asegurar que el input mantenga el foco
    inputRef.current?.focus();
  };

  return (
    <>
      <TextInput
        ref={inputRef}
        placeholder={
          isSecondDegree ? "Ejemplo: x² + 2x - 3 = 5" : "Ejemplo: 2x + 4 = 10"
        }
        placeholderTextColor={colors.CLR_PLACEHOLDER}
        value={equation}
        onChangeText={setEquation}
        onFocus={handleFocus}
        onSelectionChange={(e) => {
          setSelection({
            start: e.nativeEvent.selection.start,
            end: e.nativeEvent.selection.end,
          });
        }}
        selection={selection}
        showSoftInputOnFocus={false}
        style={[
          styles.input,
          {
            borderColor: colors.CLR_BORDER,
            backgroundColor: colors.CLR_SURFACE,
            color: colors.CLR_ON_SURFACE,
          },
        ]}
      />

      <TouchableOpacity
        onPress={() => setShowKeyboard(!showKeyboard)}
        style={[styles.button, { backgroundColor: colors.CLR_TOGGLE }]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {showKeyboard ? "OCULTAR TECLADO" : "MOSTRAR TECLADO"}
        </Text>
      </TouchableOpacity>

      {showKeyboard && (
        <View
          style={[
            styles.keyboardContainer,
            {
              backgroundColor: colors.CLR_SURFACE,
              borderColor: colors.CLR_BORDER,
            },
          ]}
        >
          {/* Primera fila: Números 1-3 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("1")}
            >
              <Text style={styles.keyButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("2")}
            >
              <Text style={styles.keyButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("3")}
            >
              <Text style={styles.keyButtonText}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_SECONDARY }]}
              onPress={() => insertText("x")}
            >
              <Text style={styles.keyButtonText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Segunda fila: Números 4-6 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("4")}
            >
              <Text style={styles.keyButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("5")}
            >
              <Text style={styles.keyButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("6")}
            >
              <Text style={styles.keyButtonText}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_SECONDARY }]}
              onPress={() => insertText("x²")}
            >
              <Text style={styles.keyButtonText}>x²</Text>
            </TouchableOpacity>
          </View>

          {/* Tercera fila: Números 7-9 */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("7")}
            >
              <Text style={styles.keyButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("8")}
            >
              <Text style={styles.keyButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("9")}
            >
              <Text style={styles.keyButtonText}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("+")}
            >
              <Text style={styles.keyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Cuarta fila: 0, operadores y controles */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("0")}
            >
              <Text style={styles.keyButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("-")}
            >
              <Text style={styles.keyButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("=")}
            >
              <Text style={styles.keyButtonText}>=</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButton, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => insertText(" ")}
            >
              <Text style={styles.keyButtonText}>␣</Text>
            </TouchableOpacity>
          </View>

          {/* Quinta fila: Controles de cursor y borrar */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.keyButtonWide, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => moveCursor("left")}
            >
              <Text style={styles.keyButtonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButtonWide, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => moveCursor("right")}
            >
              <Text style={styles.keyButtonText}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keyButtonWide, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={deleteText}
            >
              <Text style={styles.keyButtonText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
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
  keyboardContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  keyButton: {
    flex: 1,
    height: 50,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  keyButtonWide: {
    flex: 2,
    height: 50,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  keyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

