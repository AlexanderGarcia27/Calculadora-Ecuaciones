import { evaluate } from "mathjs";
import { TableItem, QuadraticCoefficients } from "../types";

export const solveLinearEquation = (equation: string): {
  solution: string;
  tableData: TableItem[];
} | null => {
  const [left, right] = equation.split("=");
  if (!left || !right) {
    return null;
  }

  const f = (x: number): number => evaluate(left, { x }) - evaluate(right, { x });

  let x = 0;
  let found = false;
  for (let i = -100; i <= 100; i += 0.1) {
    if (Math.abs(f(i)) < 0.001) {
      x = parseFloat(i.toFixed(2));
      found = true;
      break;
    }
  }

  if (!found) {
    return null;
  }

  const tabla: TableItem[] = [];
  for (let i = -5; i <= 5; i++) {
    const y = evaluate(left, { x: i }).toFixed(2);
    tabla.push({ x: i, y });
  }

  return {
    solution: x.toString(),
    tableData: tabla,
  };
};

export const extractQuadraticCoefficients = (
  eq: string
): QuadraticCoefficients | null => {
  try {
    const normalized = eq.replace(/\s+/g, "");
    const parts = normalized.split("=");
    const left = parts[0];
    const right = parts[1] || "0";
    
    const aMatch = left.match(/([-+]?\d*\.?\d*)x²/i);
    const bMatch = left.match(/([+-]\d*\.?\d*)x(?!²)/i);
    const cMatch = left.match(/([+-]\d*\.?\d+)(?!x)/);
    
    const a = aMatch ? parseFloat(aMatch[1] || "1") : 0;
    const b = bMatch ? parseFloat(bMatch[1]) : 0;
    const cLeft = cMatch ? parseFloat(cMatch[1]) : 0;
    const rightValue = parseFloat(right);
    
    // Convertir a forma estándar: restar el lado derecho del término constante
    const c = cLeft - rightValue;
    
    return { a, b, c, originalRight: rightValue };
  } catch {
    return null;
  }
};

export const solveQuadraticEquation = (equation: string): {
  solution: string;
  tableData: TableItem[];
  discriminant: number;
  coefficients: QuadraticCoefficients;
} | null => {
  const coefficients = extractQuadraticCoefficients(equation);
  if (!coefficients) {
    return null;
  }

  const { a, b, c, originalRight } = coefficients;
  const discriminant = b * b - 4 * a * c;

  let solution: string = "";
  let tabla: TableItem[] = [];

  // 🔹 Caso 1: dos soluciones reales
  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    solution = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;

  // 🔹 Caso 2: una solución real doble
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    solution = `x = ${x.toFixed(2)}`;

  // 🔹 Caso 3: soluciones complejas (discriminante < 0)
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    solution = `x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
  }

  // 🔹 Generar tabla de valores reales para la gráfica
  const cOriginal = c + originalRight;
  for (let i = -10; i <= 10; i += 1) {
    const y = (a * i * i + b * i + cOriginal).toFixed(2);
    tabla.push({ x: i, y });
  }

  return {
    solution,
    tableData: tabla,
    discriminant,
    coefficients,
  };
};


