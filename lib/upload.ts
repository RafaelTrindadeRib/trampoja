import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf']

const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024

type FileCategory = 'photo' | 'document'

function getAllowedTypes(category: FileCategory): string[] {
  return category === 'photo' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES
}

function getMaxSize(category: FileCategory): number {
  return category === 'photo' ? MAX_PHOTO_SIZE : MAX_DOCUMENT_SIZE
}

function getMaxSizeMB(category: FileCategory): number {
  return category === 'photo' ? 5 : 10
}

function generateFileName(originalName: string): string {
  const extension = path.extname(originalName).toLowerCase()
  const uniqueId = crypto.randomUUID()
  return `${uniqueId}${extension}`
}

function validateFile(
  file: File,
  category: FileCategory,
): { valid: true } | { valid: false; error: string } {
  const allowedTypes = getAllowedTypes(category)
  const maxSize = getMaxSize(category)

  if (!allowedTypes.includes(file.type)) {
    const allowed = allowedTypes.map((t) => t.split('/')[1]).join(', ')
    return {
      valid: false,
      error: `Tipo de arquivo invalido. Permitido: ${allowed}`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Maximo: ${getMaxSizeMB(category)}MB`,
    }
  }

  return { valid: true }
}

export async function saveUploadedFile(
  file: File,
  folder: string,
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadsDir, { recursive: true })

  const fileName = generateFileName(file.name)
  const filePath = path.join(uploadsDir, fileName)

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await writeFile(filePath, buffer)

  return `/uploads/${folder}/${fileName}`
}

export async function saveWorkerPhoto(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const validation = validateFile(file, 'photo')
  if (!validation.valid) {
    return { error: validation.error }
  }
  const url = await saveUploadedFile(file, 'workers/photos')
  return { url }
}

export async function saveWorkerDocument(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const validation = validateFile(file, 'document')
  if (!validation.valid) {
    return { error: validation.error }
  }
  const url = await saveUploadedFile(file, 'workers/documents')
  return { url }
}
