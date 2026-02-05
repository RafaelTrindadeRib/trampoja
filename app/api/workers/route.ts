import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { validateCPF } from '@/lib/validators'
import { createWorkerSchema } from '@/lib/validators/schemas/worker'
import type { SkillType } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()

    if (user.worker) {
      return NextResponse.json(
        { error: 'Perfil de trabalhador ja existe', success: false },
        { status: 409 },
      )
    }

    const body: unknown = await request.json()
    const parsed = createWorkerSchema.safeParse(body)

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

    if (!validateCPF(data.cpf)) {
      return NextResponse.json(
        { error: 'CPF invalido', success: false },
        { status: 400 },
      )
    }

    const existingCpf = await prisma.worker.findUnique({
      where: { cpf: data.cpf },
    })

    if (existingCpf) {
      return NextResponse.json(
        { error: 'CPF ja cadastrado', success: false },
        { status: 409 },
      )
    }

    const worker = await prisma.worker.create({
      data: {
        userId: user.id,
        cpf: data.cpf,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        lat: data.lat,
        lng: data.lng,
        searchRadius: data.searchRadius,
        minHourlyRate: data.minHourlyRate,
        skills: data.skills as SkillType[],
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { type: 'WORKER', phone: data.phone },
    })

    return NextResponse.json({ data: worker, success: true }, { status: 201 })
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

    console.error('POST /api/workers error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
