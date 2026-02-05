import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { updateWorkerSchema } from '@/lib/validators/schemas/worker'
import type { SkillType } from '@prisma/client'

export async function GET() {
  try {
    const user = await getAuthUser()

    const worker = await prisma.worker.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            type: true,
            createdAt: true,
          },
        },
        availabilities: {
          where: { date: { gte: new Date() } },
          orderBy: { date: 'asc' },
          take: 20,
        },
      },
    })

    if (!worker) {
      return NextResponse.json(
        { error: 'Perfil de trabalhador nao encontrado', success: false },
        { status: 404 },
      )
    }

    return NextResponse.json({ data: worker, success: true })
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

    console.error('GET /api/workers/me error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()

    const existingWorker = await prisma.worker.findUnique({
      where: { userId: user.id },
    })

    if (!existingWorker) {
      return NextResponse.json(
        { error: 'Perfil de trabalhador nao encontrado', success: false },
        { status: 404 },
      )
    }

    const body: unknown = await request.json()
    const parsed = updateWorkerSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        {
          error: firstError?.message ?? 'Dados invalidos',
          details: parsed.error.issues,
          success: false,
        },
        { status: 400 },
      )
    }

    const data = parsed.data

    const updateData: Record<string, unknown> = {}

    if (data.firstName !== undefined) updateData.firstName = data.firstName
    if (data.lastName !== undefined) updateData.lastName = data.lastName
    if (data.dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(data.dateOfBirth)
    if (data.address !== undefined) updateData.address = data.address
    if (data.city !== undefined) updateData.city = data.city
    if (data.state !== undefined) updateData.state = data.state
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode
    if (data.lat !== undefined) updateData.lat = data.lat
    if (data.lng !== undefined) updateData.lng = data.lng
    if (data.searchRadius !== undefined)
      updateData.searchRadius = data.searchRadius
    if (data.minHourlyRate !== undefined)
      updateData.minHourlyRate = data.minHourlyRate
    if (data.skills !== undefined)
      updateData.skills = data.skills as SkillType[]

    const worker = await prisma.worker.update({
      where: { userId: user.id },
      data: updateData,
    })

    if (data.phone !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: data.phone },
      })
    }

    return NextResponse.json({ data: worker, success: true })
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

    console.error('PATCH /api/workers/me error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
