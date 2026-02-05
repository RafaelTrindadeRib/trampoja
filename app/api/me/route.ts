import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    return NextResponse.json({ data: user, success: true })
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 },
    )
  }
}
