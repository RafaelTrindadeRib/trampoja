import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'markets')

type PhotoField = 'photoUrl' | 'bannerUrl'

function isValidPhotoField(field: string): field is PhotoField {
  return field === 'photoUrl' || field === 'bannerUrl'
}

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const extension = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${randomUUID()}.${extension}`

  await mkdir(UPLOAD_DIR, { recursive: true })

  const filePath = path.join(UPLOAD_DIR, fileName)
  await writeFile(filePath, buffer)

  return `/uploads/markets/${fileName}`
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()

    const market = await prisma.market.findUnique({
      where: { userId: user.id },
    })

    if (!market) {
      return NextResponse.json(
        { error: 'Perfil de mercado nao encontrado', success: false },
        { status: 404 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const field = (formData.get('field') as string) ?? 'photoUrl'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado', success: false },
        { status: 400 },
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Tipo de arquivo invalido. Use JPEG, PNG ou WebP',
          success: false,
        },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo excede o limite de 5MB', success: false },
        { status: 400 },
      )
    }

    if (!isValidPhotoField(field)) {
      return NextResponse.json(
        {
          error: 'Campo invalido. Use "photoUrl" ou "bannerUrl"',
          success: false,
        },
        { status: 400 },
      )
    }

    const url = await saveUploadedFile(file)

    const updatedMarket = await prisma.market.update({
      where: { id: market.id },
      data: { [field]: url },
    })

    return NextResponse.json(
      { data: { url, field, market: updatedMarket }, success: true },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Nao autorizado', success: false },
        { status: 401 },
      )
    }

    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { error: 'Usuario nao encontrado', success: false },
        { status: 404 },
      )
    }

    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser()

    const market = await prisma.market.findUnique({
      where: { userId: user.id },
    })

    if (!market) {
      return NextResponse.json(
        { error: 'Perfil de mercado nao encontrado', success: false },
        { status: 404 },
      )
    }

    const body = await request.json()
    const { field } = body as { field?: string }

    if (!field || !isValidPhotoField(field)) {
      return NextResponse.json(
        {
          error: 'Campo invalido. Use "photoUrl" ou "bannerUrl"',
          success: false,
        },
        { status: 400 },
      )
    }

    const currentUrl = market[field]

    if (!currentUrl) {
      return NextResponse.json(
        { error: 'Nenhuma foto para remover', success: false },
        { status: 404 },
      )
    }

    try {
      const filePath = path.join(process.cwd(), 'public', currentUrl)
      await unlink(filePath)
    } catch {
      // File may not exist on disk, continue with DB update
    }

    const updatedMarket = await prisma.market.update({
      where: { id: market.id },
      data: { [field]: null },
    })

    return NextResponse.json({ data: updatedMarket, success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Nao autorizado', success: false },
        { status: 401 },
      )
    }

    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { error: 'Usuario nao encontrado', success: false },
        { status: 404 },
      )
    }

    console.error('Error deleting photo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
