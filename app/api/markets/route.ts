import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createMarketSchema } from '@/lib/validators/schemas/market'
import { validateCNPJ } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()

    if (user.market) {
      return NextResponse.json(
        { error: 'Usuario ja possui perfil de mercado', success: false },
        { status: 409 },
      )
    }

    const body = await request.json()
    const parsed = createMarketSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { error: 'Dados invalidos', details: errors, success: false },
        { status: 400 },
      )
    }

    const { cnpj } = parsed.data

    if (!validateCNPJ(cnpj)) {
      return NextResponse.json(
        { error: 'CNPJ invalido', success: false },
        { status: 400 },
      )
    }

    const existingCnpj = await prisma.market.findUnique({
      where: { cnpj },
    })

    if (existingCnpj) {
      return NextResponse.json(
        { error: 'CNPJ ja cadastrado', success: false },
        { status: 409 },
      )
    }

    const market = await prisma.market.create({
      data: {
        userId: user.id,
        cnpj: parsed.data.cnpj,
        tradeName: parsed.data.tradeName,
        legalName: parsed.data.legalName,
        description: parsed.data.description,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        zipCode: parsed.data.zipCode,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        phone: parsed.data.phone,
      },
    })

    return NextResponse.json({ data: market, success: true }, { status: 201 })
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

    console.error('Error creating market:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
