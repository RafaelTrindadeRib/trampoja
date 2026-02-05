import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getAuthUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { worker: true, market: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
