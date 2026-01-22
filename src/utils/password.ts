// src/utils/password.ts
function securePick(chars: string) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return chars[arr[0] % chars.length];
}

function secureShuffle<T>(items: T[]) {
  // Fisher–Yates con crypto
  for (let i = items.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const j = arr[0] % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function generateRandomPassword(length = 12) {
  // Si length < 3 no se puede cumplir la regla (U + L + D)
  const minLength = 3;
  const finalLength = Math.max(length, minLength);

  const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const LOWER = "abcdefghijkmnopqrstuvwxyz";
  const DIGIT = "23456789";
  const SYMBOL = "!@#$%&*_-+=";

  const ALL = UPPER + LOWER + DIGIT + SYMBOL;

  // ✅ Garantías mínimas
  const result: string[] = [
    securePick(UPPER), // 1 mayúscula
    securePick(LOWER), // 1 minúscula
    securePick(DIGIT), // 1 número
  ];

  // Rellenar el resto con el set completo
  while (result.length < finalLength) {
    result.push(securePick(ALL));
  }

  // ✅ Mezclar para no dejar patrón fijo
  secureShuffle(result);

  return result.join("");
}
