import { QuadraticCoefficients } from "../types";

export const normalizeEquation = (eq: string): string => eq.replace(/\s+/g, "");

export const generateLinearProcedure = (eq: string): string[] => {
  try {
    const normalized = eq.replace(/\s+/g, "");
    const [left, right] = normalized.split("=");
    const match = left.match(/^([-+]?\d*\.?\d*)x([+-]\d*\.?\d+)?$/i);
    if (!match) return ["No se pudo generar el procedimiento para este formato."];
    let aStr = match[1];
    const bStr = match[2] || "+0";
    if (aStr === "" || aStr === "+") aStr = "1";
    if (aStr === "-") aStr = "-1";
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);
    const c = parseFloat(right);

    const steps: string[] = [];
    steps.push(`Ecuación inicial: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`);
    const step2Right = c - b;
    steps.push(`Restar ${b} de ambos lados: ${a}x = ${step2Right}`);
    const solution = step2Right / a;
    steps.push(`Dividir ambos lados entre ${a}: x = ${solution}`);
    return steps;
  } catch (e) {
    return ["No se pudo generar el procedimiento."];
  }
};

export const generateQuadraticProcedure = (
  coefficients: QuadraticCoefficients,
  discriminant: number,
  originalRight: number
): string[] => {
  const { a, b, c } = coefficients;
  const steps: string[] = [];
  
  // Mostrar la ecuación original
  const cOriginal = c + originalRight;
  
  // Formatear el término ax²
  let aTerm = '';
  if (a === 1) aTerm = 'x²';
  else if (a === -1) aTerm = '-x²';
  else aTerm = `${a}x²`;
  
  // Formatear el término bx
  let bTerm = '';
  if (b !== 0) {
    const bSign = b >= 0 ? '+' : '-';
    const bAbs = Math.abs(b);
    if (bAbs === 1) bTerm = ` ${bSign} x`;
    else bTerm = ` ${bSign} ${bAbs}x`;
  }
  
  // Formatear el término constante
  let cTerm = '';
  if (cOriginal !== 0) {
    const cSign = cOriginal >= 0 ? '+' : '-';
    const cAbs = Math.abs(cOriginal);
    cTerm = ` ${cSign} ${cAbs}`;
  }
  
  steps.push(`Ecuación inicial: ${aTerm}${bTerm}${cTerm} = ${originalRight}`);
  
  // Si el lado derecho no es 0, mostrar el paso de conversión
  if (originalRight !== 0) {
    // Formatear el término constante después de la conversión
    let cTermConverted = '';
    if (c !== 0) {
      const cSign = c >= 0 ? '+' : '-';
      const cAbs = Math.abs(c);
      cTermConverted = ` ${cSign} ${cAbs}`;
    }
    
    steps.push(`Restar ${originalRight} de ambos lados: ${aTerm}${bTerm}${cTermConverted} = 0`);
  }
  
  steps.push(`Coeficientes: a = ${a}, b = ${b}, c = ${c}`);
  steps.push(`Fórmula cuadrática: x = (-b ± √(b² - 4ac)) / 2a`);
  steps.push(`Discriminante: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);
  
  if (discriminant > 0) {
    steps.push(`Δ > 0: Dos soluciones reales`);
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    steps.push(`x₁ = (-${b} + √${discriminant}) / ${2 * a} = ${x1.toFixed(2)}`);
    steps.push(`x₂ = (-${b} - √${discriminant}) / ${2 * a} = ${x2.toFixed(2)}`);
  } else if (discriminant === 0) {
    steps.push(`Δ = 0: Una solución real`);
    const x = -b / (2 * a);
    steps.push(`x = -${b} / (2 × ${a}) = ${x.toFixed(2)}`);
  } else {
    steps.push(`Δ < 0: No hay soluciones reales`);
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    steps.push(`Soluciones complejas:`);
    steps.push(`x₁ = ${realPart} + ${imaginaryPart}i`);
    steps.push(`x₂ = ${realPart} - ${imaginaryPart}i`);
  }
  
  return steps;
};


