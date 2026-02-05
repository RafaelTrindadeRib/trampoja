import { validateCPF } from './cpf'
import { validateCNPJ } from './cnpj'

export type ValidationResult = {
  valid: boolean
  error?: string
}

export interface DocumentValidator {
  validateCPF(cpf: string): ValidationResult
  validateCNPJ(cnpj: string): ValidationResult
}

class LocalDocumentValidator implements DocumentValidator {
  validateCPF(cpf: string): ValidationResult {
    if (!cpf || cpf.trim().length === 0) {
      return { valid: false, error: 'CPF is required' }
    }
    const isValid = validateCPF(cpf)
    return isValid ? { valid: true } : { valid: false, error: 'Invalid CPF' }
  }

  validateCNPJ(cnpj: string): ValidationResult {
    if (!cnpj || cnpj.trim().length === 0) {
      return { valid: false, error: 'CNPJ is required' }
    }
    const isValid = validateCNPJ(cnpj)
    return isValid ? { valid: true } : { valid: false, error: 'Invalid CNPJ' }
  }
}

export function getDocumentValidator(): DocumentValidator {
  return new LocalDocumentValidator()
}
