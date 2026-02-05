'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMarketOnboarding } from '@/components/onboarding/market-onboarding-context'
import { cn } from '@/lib/utils/cn'

type PhotoField = 'photoUrl' | 'bannerUrl'

interface UploadState {
  isUploading: boolean
  error: string
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="24"
      height="24"
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
      width="24"
      height="24"
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

function PhotoUploadZone({
  field,
  label,
  description,
  currentUrl,
  aspectClass,
  onUpload,
  onDelete,
  uploadState,
}: {
  field: PhotoField
  label: string
  description: string
  currentUrl: string
  aspectClass: string
  onUpload: (field: PhotoField, file: File) => void
  onDelete: (field: PhotoField) => void
  uploadState: UploadState
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(field, file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(field, file)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (currentUrl) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-700 text-sm font-medium">{label}</p>
        <div className={cn('relative overflow-hidden rounded-lg', aspectClass)}>
          <Image
            src={currentUrl}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onDelete(field)}
            disabled={uploadState.isUploading}
          >
            <TrashIcon className="h-4 w-4" />
            Remover
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-700 text-sm font-medium">{label}</p>
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          aspectClass,
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-muted-300 hover:border-primary-400 hover:bg-muted-50',
          uploadState.isUploading && 'pointer-events-none opacity-50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          aria-label={`Upload ${label}`}
        />
        <UploadIcon className="text-muted-400 mb-2 h-8 w-8" />
        <p className="text-muted-600 text-sm font-medium">{description}</p>
        <p className="text-muted-400 mt-1 text-xs">
          JPEG, PNG ou WebP (max 5MB)
        </p>
      </div>
      {uploadState.error && (
        <p className="text-destructive-600 text-sm">{uploadState.error}</p>
      )}
    </div>
  )
}

export default function MarketOnboardingStep3() {
  const router = useRouter()
  const { formData, updateFormData } = useMarketOnboarding()
  const [logoState, setLogoState] = useState<UploadState>({
    isUploading: false,
    error: '',
  })
  const [bannerState, setBannerState] = useState<UploadState>({
    isUploading: false,
    error: '',
  })

  const handleUpload = useCallback(
    async (field: PhotoField, file: File) => {
      const setState = field === 'photoUrl' ? setLogoState : setBannerState

      if (file.size > 5 * 1024 * 1024) {
        setState({ isUploading: false, error: 'Arquivo excede 5MB' })
        return
      }

      setState({ isUploading: true, error: '' })

      try {
        const form = new FormData()
        form.append('file', file)
        form.append('field', field)

        const response = await fetch('/api/markets/me/photos', {
          method: 'POST',
          body: form,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Erro ao enviar foto')
        }

        const { data } = await response.json()
        updateFormData({ [field]: data.url as string })
        setState({ isUploading: false, error: '' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao enviar foto'
        setState({ isUploading: false, error: message })
      }
    },
    [updateFormData],
  )

  const handleDelete = useCallback(
    async (field: PhotoField) => {
      const setState = field === 'photoUrl' ? setLogoState : setBannerState
      setState({ isUploading: true, error: '' })

      try {
        const response = await fetch('/api/markets/me/photos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Erro ao remover foto')
        }

        updateFormData({ [field]: '' })
        setState({ isUploading: false, error: '' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao remover foto'
        setState({ isUploading: false, error: message })
      }
    },
    [updateFormData],
  )

  const isUploading = logoState.isUploading || bannerState.isUploading

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
            <CameraIcon className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h2 className="text-muted-900 text-lg font-semibold">Fotos</h2>
            <p className="text-muted-500 text-sm">
              Adicione o logo e banner do seu estabelecimento
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <PhotoUploadZone
            field="photoUrl"
            label="Logo"
            description="Arraste ou clique para enviar o logo"
            currentUrl={formData.photoUrl}
            aspectClass="h-40"
            onUpload={handleUpload}
            onDelete={handleDelete}
            uploadState={logoState}
          />

          <PhotoUploadZone
            field="bannerUrl"
            label="Banner"
            description="Arraste ou clique para enviar o banner"
            currentUrl={formData.bannerUrl}
            aspectClass="h-32"
            onUpload={handleUpload}
            onDelete={handleDelete}
            uploadState={bannerState}
          />

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/market/step-2')}
              disabled={isUploading}
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/onboarding/market/step-4')}
              disabled={isUploading}
            >
              Proximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
