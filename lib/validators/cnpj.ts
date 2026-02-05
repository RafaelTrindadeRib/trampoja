const CNPJ_LENGTH = 14
const FIRST_DIGIT_MULTIPLIERS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_DIGIT_MULTIPLIERS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const CHECK_DIGIT_DIVISOR = 11

function isAllSameDigit(digits: string): boolean {
  return digits.split('').every((digit) => digit === digits[0])
}

function calculateCheckDigit(digits: string, multipliers: number[]): number {
  const sum = multipliers.reduce((acc, multiplier, index) => {
    return acc + Number(digits[index]) * multiplier
  }, 0)

  const remainder = sum % CHECK_DIGIT_DIVISOR
  return remainder < 2 ? 0 : CHECK_DIGIT_DIVISOR - remainder
}

export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}

export function formatCNPJ(cnpj: string): string {
  const digits = cleanCNPJ(cnpj)
  if (digits.length !== CNPJ_LENGTH) {
    return cnpj
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cleanCNPJ(cnpj)

  if (digits.length !== CNPJ_LENGTH) {
    return false
  }

  if (isAllSameDigit(digits)) {
    return false
  }

  const firstCheckDigit = calculateCheckDigit(digits, FIRST_DIGIT_MULTIPLIERS)
  if (firstCheckDigit !== Number(digits[12])) {
    return false
  }

  const secondCheckDigit = calculateCheckDigit(digits, SECOND_DIGIT_MULTIPLIERS)
  if (secondCheckDigit !== Number(digits[13])) {
    return false
  }

  return true
}
