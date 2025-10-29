export const validateLinearEquation = (eq: string): boolean => {
  if (!eq || typeof eq !== "string") return false;
  const normalized = eq.replace(/\s+/g, "");
  const parts = normalized.split("=");
  if (parts.length !== 2) return false;
  const left = parts[0];
  const right = parts[1];
  if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;
  const leftPattern = /^[-+]?\d*\.?\d*x([+-]\d*\.?\d+)?$/i;
  return leftPattern.test(left);
};

export const validateQuadraticEquation = (eq: string): boolean => {
  if (!eq || typeof eq !== "string") return false;
  const normalized = eq.replace(/\s+/g, "");
  const parts = normalized.split("=");
  if (parts.length !== 2) return false;
  const left = parts[0];
  const right = parts[1];
  // Aceptar cualquier número en el lado derecho
  if (!/^[-+]?\d*\.?\d+$/.test(right)) return false;
  const quadraticPattern = /^[-+]?\d*\.?\d*x²([+-]\d*\.?\d*x)?([+-]\d*\.?\d+)?$/i;
  return quadraticPattern.test(left);
};


