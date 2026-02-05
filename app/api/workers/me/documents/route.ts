import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { saveWorkerPhoto, saveWorkerDocument } from '@/lib/upload'

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()

    const worker = await prisma.worker.findUnique({
      where: { userId: user.id },
    })

    if (!worker) {
      return NextResponse.json(
        { error: 'Perfil de trabalhador nao encontrado', success: false },
        { status: 404 },
      )
    }

    const formData = await request.formData()
    const photoFile = formData.get('photo')
    const documentFile = formData.get('document')

    if (!photoFile && !documentFile) {
      return NextResponse.json(
        {
          error: 'Envie pelo menos um arquivo (photo ou document)',
          success: false,
        },
        { status: 400 },
      )
    }

    const updateData: { photoUrl?: string; documentUrl?: string } = {}
    const urls: { photoUrl?: string; documentUrl?: string } = {}

    if (photoFile && photoFile instanceof File) {
      const photoResult = await saveWorkerPhoto(photoFile)
      if ('error' in photoResult) {
        return NextResponse.json(
          { error: photoResult.error, success: false },
          { status: 400 },
        )
      }
      updateData.photoUrl = photoResult.url
      urls.photoUrl = photoResult.url
    }

    if (documentFile && documentFile instanceof File) {
      const documentResult = await saveWorkerDocument(documentFile)
      if ('error' in documentResult) {
        return NextResponse.json(
          { error: documentResult.error, success: false },
          { status: 400 },
        )
      }
      updateData.documentUrl = documentResult.url
      urls.documentUrl = documentResult.url
    }

    await prisma.worker.update({
      where: { id: worker.id },
      data: updateData,
    })

    return NextResponse.json({ data: urls, success: true })
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

    console.error('POST /api/workers/me/documents error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
