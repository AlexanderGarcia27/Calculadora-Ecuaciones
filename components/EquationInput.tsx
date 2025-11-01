import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Selection } from "../types";
import { getThemeColors } from "../constants/colors";
import { equationInputStyles } from "../styles/EquationInput.styles";

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
          equationInputStyles.input,
          {
            borderColor: colors.CLR_BORDER,
            backgroundColor: colors.CLR_SURFACE,
            color: colors.CLR_ON_SURFACE,
          },
        ]}
      />

      <TouchableOpacity
        onPress={() => setShowKeyboard(!showKeyboard)}
        style={[equationInputStyles.button, { backgroundColor: colors.CLR_TOGGLE }]}
        activeOpacity={0.8}
      >
        <Text style={equationInputStyles.buttonText}>
          {showKeyboard ? "OCULTAR TECLADO" : "MOSTRAR TECLADO"}
        </Text>
      </TouchableOpacity>

      {showKeyboard && (
        <View
          style={[
            equationInputStyles.keyboardContainer,
            {
              backgroundColor: colors.CLR_SURFACE,
              borderColor: colors.CLR_BORDER,
            },
          ]}
        >
          {/* Primera fila: Números 1-3 */}
          <View style={equationInputStyles.keyboardRow}>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("1")}
            >
              <Text style={equationInputStyles.keyButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("2")}
            >
              <Text style={equationInputStyles.keyButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("3")}
            >
              <Text style={equationInputStyles.keyButtonText}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_SECONDARY }]}
              onPress={() => insertText("x")}
            >
              <Text style={equationInputStyles.keyButtonText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Segunda fila: Números 4-6 */}
          <View style={equationInputStyles.keyboardRow}>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("4")}
            >
              <Text style={equationInputStyles.keyButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("5")}
            >
              <Text style={equationInputStyles.keyButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("6")}
            >
              <Text style={equationInputStyles.keyButtonText}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_SECONDARY }]}
              onPress={() => insertText("x²")}
            >
              <Text style={equationInputStyles.keyButtonText}>x²</Text>
            </TouchableOpacity>
          </View>

          {/* Tercera fila: Números 7-9 */}
          <View style={equationInputStyles.keyboardRow}>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("7")}
            >
              <Text style={equationInputStyles.keyButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("8")}
            >
              <Text style={equationInputStyles.keyButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("9")}
            >
              <Text style={equationInputStyles.keyButtonText}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("+")}
            >
              <Text style={equationInputStyles.keyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Cuarta fila: 0, operadores y controles */}
          <View style={equationInputStyles.keyboardRow}>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PRIMARY }]}
              onPress={() => insertText("0")}
            >
              <Text style={equationInputStyles.keyButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("-")}
            >
              <Text style={equationInputStyles.keyButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={() => insertText("=")}
            >
              <Text style={equationInputStyles.keyButtonText}>=</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButton, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => insertText(" ")}
            >
              <Text style={equationInputStyles.keyButtonText}>␣</Text>
            </TouchableOpacity>
          </View>

          {/* Quinta fila: Controles de cursor y borrar */}
          <View style={equationInputStyles.keyboardRow}>
            <TouchableOpacity
              style={[equationInputStyles.keyButtonWide, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => moveCursor("left")}
            >
              <Text style={equationInputStyles.keyButtonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButtonWide, { backgroundColor: colors.CLR_PROCEDURE }]}
              onPress={() => moveCursor("right")}
            >
              <Text style={equationInputStyles.keyButtonText}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[equationInputStyles.keyButtonWide, { backgroundColor: colors.CLR_ACCENT }]}
              onPress={deleteText}
            >
              <Text style={equationInputStyles.keyButtonText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

