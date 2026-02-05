'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { useWorkerOnboarding } from '@/components/onboarding/worker-onboarding-context'

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

interface FileUploadZoneProps {
  label: string
  accept: string
  icon: 'camera' | 'document'
  preview: string | null
  isCircular?: boolean
  onFileSelect: (file: File) => void
  uploading: boolean
  error: string | null
}

function FileUploadZone({
  label,
  accept,
  icon,
  preview,
  isCircular,
  onFileSelect,
  uploading,
  error,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  const IconComponent = icon === 'camera' ? CameraIcon : DocumentIcon

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-700 text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={uploading}
        className={cn(
          'border-muted-300 flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 transition-colors',
          isDragging && 'border-primary-500 bg-primary-50',
          !isDragging && 'hover:border-primary-400 hover:bg-muted-50',
          isCircular
            ? 'mx-auto h-40 w-40 rounded-full'
            : 'w-full rounded-lg',
          uploading && 'cursor-not-allowed opacity-50',
        )}
      >
        {preview ? (
          isCircular ? (
            <Image
              src={preview}
              alt="Preview da foto"
              width={160}
              height={160}
              className="h-full w-full rounded-full object-cover"
              unoptimized
            />
          ) : (
            <Image
              src={preview}
              alt="Preview do documento"
              width={200}
              height={96}
              className="max-h-24 rounded object-contain"
              unoptimized
            />
          )
        ) : (
          <>
            <IconComponent className="text-muted-400 h-10 w-10" />
            <UploadIcon className="text-muted-300 h-5 w-5" />
            <span className="text-muted-500 text-center text-sm">
              Arraste ou clique para enviar
            </span>
          </>
        )}
        {uploading && (
          <span className="text-primary-600 text-sm font-medium">
            Enviando...
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />
      {error && (
        <p className="text-destructive-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function WorkerOnboardingStep3() {
  const router = useRouter()
  const { data, updateData } = useWorkerOnboarding()
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photoUrl ?? null,
  )
  const [docPreview, setDocPreview] = useState<string | null>(
    data.documentUrl ?? null,
  )
  const [photoUploading, setPhotoUploading] = useState(false)
  const [docUploading, setDocUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [docError, setDocError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  async function uploadFile(file: File, type: 'photo' | 'document') {
    const formData = new FormData()
    formData.append(type, file)

    const response = await fetch('/api/workers/me/documents', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(
        (body as { error?: string } | null)?.error ?? 'Erro ao enviar arquivo',
      )
    }

    return response.json() as Promise<{ url: string }>
  }

  async function handlePhotoSelect(file: File) {
    setPhotoError(null)
    setPhotoUploading(true)

    const objectUrl = URL.createObjectURL(file)
    setPhotoPreview(objectUrl)

    try {
      const result = await uploadFile(file, 'photo')
      updateData({ photoUrl: result.url })
      setPhotoPreview(result.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar foto'
      setPhotoError(message)
      setPhotoPreview(null)
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleDocSelect(file: File) {
    setDocError(null)
    setDocUploading(true)

    if (file.type.startsWith('image/')) {
      setDocPreview(URL.createObjectURL(file))
    } else {
      setDocPreview(null)
    }

    try {
      const result = await uploadFile(file, 'document')
      updateData({ documentUrl: result.url })
      if (file.type.startsWith('image/')) {
        setDocPreview(result.url)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao enviar documento'
      setDocError(message)
      setDocPreview(null)
    } finally {
      setDocUploading(false)
    }
  }

  function handleNext() {
    setFormError(null)
    if (!data.photoUrl) {
      setFormError('Envie sua foto de perfil antes de continuar.')
      return
    }
    if (!data.documentUrl) {
      setFormError('Envie um documento antes de continuar.')
      return
    }
    router.push('/onboarding/worker/step-4')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-muted-900 text-lg font-semibold">
          Foto e Documento
        </h2>
        <p className="text-muted-500 text-sm">
          Envie sua foto de perfil e um documento de identidade.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <FileUploadZone
            label="Foto de perfil"
            accept="image/jpeg,image/png"
            icon="camera"
            preview={photoPreview}
            isCircular
            onFileSelect={handlePhotoSelect}
            uploading={photoUploading}
            error={photoError}
          />

          <FileUploadZone
            label="Documento de identidade (RG/CNH)"
            accept="image/jpeg,image/png,application/pdf"
            icon="document"
            preview={docPreview}
            onFileSelect={handleDocSelect}
            uploading={docUploading}
            error={docError}
          />

          {formError && (
            <p className="text-destructive-600 text-sm" role="alert">
              {formError}
            </p>
          )}

          <div className="mt-2 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/worker/step-2')}
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={photoUploading || docUploading}
            >
              Proximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
