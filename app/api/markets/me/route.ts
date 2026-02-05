import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateMarketSchema } from '@/lib/validators/schemas/market'

export async function GET() {
  try {
    const user = await getAuthUser()

    const market = await prisma.market.findUnique({
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
        _count: {
          select: { jobs: true },
        },
      },
    })

    if (!market) {
      return NextResponse.json(
        { error: 'Perfil de mercado nao encontrado', success: false },
        { status: 404 },
      )
    }

    return NextResponse.json({ data: market, success: true })
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

    console.error('Error fetching market:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()

    const existingMarket = await prisma.market.findUnique({
      where: { userId: user.id },
    })

    if (!existingMarket) {
      return NextResponse.json(
        { error: 'Perfil de mercado nao encontrado', success: false },
        { status: 404 },
      )
    }

    const body = await request.json()
    const parsed = updateMarketSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { error: 'Dados invalidos', details: errors, success: false },
        { status: 400 },
      )
    }

    const updatedMarket = await prisma.market.update({
      where: { userId: user.id },
      data: parsed.data,
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

    console.error('Error updating market:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 },
    )
  }
}
