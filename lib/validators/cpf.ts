const CPF_LENGTH = 11
const FIRST_DIGIT_MULTIPLIERS = [10, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_DIGIT_MULTIPLIERS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

function isAllSameDigit(digits: string): boolean {
  return digits.split('').every((digit) => digit === digits[0])
}

function calculateCheckDigit(digits: string, multipliers: number[]): number {
  const sum = multipliers.reduce((acc, multiplier, index) => {
    return acc + Number(digits[index]) * multiplier
  }, 0)

  const remainder = sum % CPF_LENGTH
  return remainder < 2 ? 0 : CPF_LENGTH - remainder
}

export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function formatCPF(cpf: string): string {
  const digits = cleanCPF(cpf)
  if (digits.length !== CPF_LENGTH) {
    return cpf
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function validateCPF(cpf: string): boolean {
  const digits = cleanCPF(cpf)

  if (digits.length !== CPF_LENGTH) {
    return false
  }

  if (isAllSameDigit(digits)) {
    return false
  }

  const firstCheckDigit = calculateCheckDigit(digits, FIRST_DIGIT_MULTIPLIERS)
  if (firstCheckDigit !== Number(digits[9])) {
    return false
  }

  const secondCheckDigit = calculateCheckDigit(digits, SECOND_DIGIT_MULTIPLIERS)
  if (secondCheckDigit !== Number(digits[10])) {
    return false
  }

  return true
}
