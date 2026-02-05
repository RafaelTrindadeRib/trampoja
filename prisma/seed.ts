import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ---------------------------------------------------
  // Clean existing data (in reverse dependency order)
  // ---------------------------------------------------
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.job.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.market.deleteMany()
  await prisma.worker.deleteMany()
  await prisma.user.deleteMany()

  // ---------------------------------------------------
  // Users (3 workers + 2 markets = 5 users)
  // ---------------------------------------------------
  const workerUser1 = await prisma.user.create({
    data: {
      clerkId: 'clerk_worker_001',
      type: 'WORKER',
      email: 'carlos.silva@email.com',
      phone: '11999001001',
      emailVerified: true,
    },
  })

  const workerUser2 = await prisma.user.create({
    data: {
      clerkId: 'clerk_worker_002',
      type: 'WORKER',
      email: 'ana.santos@email.com',
      phone: '11999002002',
      emailVerified: true,
    },
  })

  const workerUser3 = await prisma.user.create({
    data: {
      clerkId: 'clerk_worker_003',
      type: 'WORKER',
      email: 'pedro.oliveira@email.com',
      phone: '11999003003',
      emailVerified: false,
    },
  })

  const marketUser1 = await prisma.user.create({
    data: {
      clerkId: 'clerk_market_001',
      type: 'MARKET',
      email: 'contato@mercadoliberdade.com.br',
      phone: '1133001001',
      emailVerified: true,
    },
  })

  const marketUser2 = await prisma.user.create({
    data: {
      clerkId: 'clerk_market_002',
      type: 'MARKET',
      email: 'contato@superitaim.com.br',
      phone: '1133002002',
      emailVerified: true,
    },
  })

  // ---------------------------------------------------
  // Workers (3 in different Sao Paulo neighborhoods)
  // ---------------------------------------------------
  const worker1 = await prisma.worker.create({
    data: {
      userId: workerUser1.id,
      cpf: '529.982.247-25',
      firstName: 'Carlos',
      lastName: 'Silva',
      bio: 'Repositor experiente com 3 anos de atuacao em supermercados na zona sul de Sao Paulo.',
      dateOfBirth: new Date('1995-03-15'),
      address: 'Rua Domingos de Morais, 1200',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '04010-200',
      lat: -23.5874,
      lng: -46.6388,
      searchRadius: 15,
      minHourlyRate: 18.0,
      skills: ['REPOSITOR', 'ESTOQUISTA', 'EMPACOTADOR'],
      level: 3,
      rating: 4.7,
      totalJobs: 45,
      totalEarnings: 12500.0,
    },
  })

  const worker2 = await prisma.worker.create({
    data: {
      userId: workerUser2.id,
      cpf: '987.654.321-00',
      firstName: 'Ana',
      lastName: 'Santos',
      bio: 'Atendente e promotora com experiencia em feiras e eventos na regiao de Pinheiros.',
      dateOfBirth: new Date('1998-07-22'),
      address: 'Rua dos Pinheiros, 800',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '05422-001',
      lat: -23.5631,
      lng: -46.6919,
      searchRadius: 10,
      minHourlyRate: 20.0,
      skills: ['ATENDENTE', 'PROMOTOR', 'CAIXA'],
      level: 2,
      rating: 4.9,
      totalJobs: 28,
      totalEarnings: 8400.0,
    },
  })

  const worker3 = await prisma.worker.create({
    data: {
      userId: workerUser3.id,
      cpf: '123.456.789-09',
      firstName: 'Pedro',
      lastName: 'Oliveira',
      bio: 'Auxiliar de cozinha e balconista, morador da Mooca com disponibilidade integral.',
      dateOfBirth: new Date('2000-11-08'),
      address: 'Rua da Mooca, 500',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '03104-001',
      lat: -23.5588,
      lng: -46.6003,
      searchRadius: 12,
      minHourlyRate: 15.0,
      skills: ['AUXILIAR_COZINHA', 'BALCONISTA', 'LIMPEZA'],
      level: 1,
      rating: 4.2,
      totalJobs: 8,
      totalEarnings: 1800.0,
    },
  })

  // ---------------------------------------------------
  // Markets (2 in different neighborhoods)
  // ---------------------------------------------------
  const market1 = await prisma.market.create({
    data: {
      userId: marketUser1.id,
      cnpj: '12.345.678/0001-90',
      tradeName: 'Mercado Liberdade',
      legalName: 'Mercado Liberdade Comercio de Alimentos Ltda',
      description:
        'Supermercado tradicional no bairro da Liberdade, especializado em produtos orientais e nacionais.',
      address: 'Rua Galvao Bueno, 300',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01506-000',
      lat: -23.5575,
      lng: -46.6353,
      phone: '1133001001',
      rating: 4.5,
      totalJobs: 60,
    },
  })

  const market2 = await prisma.market.create({
    data: {
      userId: marketUser2.id,
      cnpj: '98.765.432/0001-10',
      tradeName: 'Super Itaim',
      legalName: 'Super Itaim Distribuidora de Alimentos SA',
      description:
        'Supermercado premium na regiao do Itaim Bibi com foco em produtos gourmet e importados.',
      address: 'Rua Joaquim Floriano, 450',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '04534-002',
      lat: -23.5847,
      lng: -46.6726,
      phone: '1133002002',
      rating: 4.8,
      totalJobs: 35,
    },
  })

  // ---------------------------------------------------
  // Availabilities (10 entries across next 7 days)
  // ---------------------------------------------------
  const today = new Date()
  const availabilities = []

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)
    // Reset time to midnight for date-only storage
    date.setHours(0, 0, 0, 0)

    if (dayOffset < 4) {
      // Worker 1: morning shift for first 4 days
      availabilities.push({
        workerId: worker1.id,
        date,
        startTime: '06:00',
        endTime: '14:00',
        status: 'AVAILABLE' as const,
      })
    }

    if (dayOffset < 3) {
      // Worker 2: afternoon shift for first 3 days
      availabilities.push({
        workerId: worker2.id,
        date,
        startTime: '14:00',
        endTime: '22:00',
        status: 'AVAILABLE' as const,
      })
    }

    if (dayOffset >= 2 && dayOffset <= 4) {
      // Worker 3: full day for days 3-5
      availabilities.push({
        workerId: worker3.id,
        date,
        startTime: '08:00',
        endTime: '18:00',
        status: 'AVAILABLE' as const,
      })
    }
  }

  for (const avail of availabilities) {
    await prisma.availability.create({ data: avail })
  }

  console.log(`  Created ${availabilities.length} availabilities`)

  // ---------------------------------------------------
  // Proposals (3: PENDING, ACCEPTED, EXPIRED)
  // ---------------------------------------------------
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const inThreeDays = new Date(today)
  inThreeDays.setDate(inThreeDays.getDate() + 3)
  inThreeDays.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  lastWeek.setHours(0, 0, 0, 0)

  // Proposal 1: PENDING - from Mercado Liberdade, no worker assigned yet
  const proposal1 = await prisma.proposal.create({
    data: {
      marketId: market1.id,
      title: 'Repositor para turno da manha',
      description:
        'Precisamos de um repositor experiente para organizar gondolas e repor mercadorias no turno da manha. Experiencia com produtos pereciveis e um diferencial.',
      date: inThreeDays,
      startTime: '06:00',
      endTime: '14:00',
      hourlyRate: 20.0,
      estimatedHours: 8.0,
      totalAmount: 160.0,
      requiredSkills: ['REPOSITOR', 'ESTOQUISTA'],
      address: 'Rua Galvao Bueno, 300',
      lat: -23.5575,
      lng: -46.6353,
      status: 'PENDING',
      expiresAt: new Date(inThreeDays.getTime() - 24 * 60 * 60 * 1000),
    },
  })

  // Proposal 2: ACCEPTED - from Super Itaim, worker 2 assigned
  const proposal2 = await prisma.proposal.create({
    data: {
      marketId: market2.id,
      workerId: worker2.id,
      title: 'Promotora para degustacao de vinhos',
      description:
        'Evento de degustacao de vinhos importados. Necessario boa comunicacao e conhecimento basico de vinhos.',
      date: tomorrow,
      startTime: '14:00',
      endTime: '20:00',
      hourlyRate: 25.0,
      estimatedHours: 6.0,
      totalAmount: 150.0,
      requiredSkills: ['PROMOTOR', 'ATENDENTE'],
      address: 'Rua Joaquim Floriano, 450',
      lat: -23.5847,
      lng: -46.6726,
      status: 'ACCEPTED',
      expiresAt: tomorrow,
    },
  })

  // Proposal 3: EXPIRED - from Mercado Liberdade, was for last week
  const proposal3 = await prisma.proposal.create({
    data: {
      marketId: market1.id,
      workerId: worker1.id,
      title: 'Auxiliar de estoque para inventario',
      description:
        'Auxilio no inventario mensal do supermercado. Necessario atencao a detalhes e agilidade na contagem.',
      date: lastWeek,
      startTime: '22:00',
      endTime: '06:00',
      hourlyRate: 22.0,
      estimatedHours: 8.0,
      totalAmount: 176.0,
      requiredSkills: ['ESTOQUISTA', 'REPOSITOR'],
      address: 'Rua Galvao Bueno, 300',
      lat: -23.5575,
      lng: -46.6353,
      status: 'EXPIRED',
      expiresAt: lastWeek,
    },
  })

  console.log('  Created 3 proposals')

  // ---------------------------------------------------
  // Jobs (1 SCHEDULED, 1 COMPLETED)
  // ---------------------------------------------------

  // Job 1: SCHEDULED (tied to accepted proposal2)
  const job1 = await prisma.job.create({
    data: {
      proposalId: proposal2.id,
      workerId: worker2.id,
      marketId: market2.id,
      status: 'SCHEDULED',
    },
  })

  // For the completed job, we need a completed proposal.
  // Create an additional ACCEPTED proposal for the completed job.
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  twoWeeksAgo.setHours(0, 0, 0, 0)

  const completedProposal = await prisma.proposal.create({
    data: {
      marketId: market1.id,
      workerId: worker1.id,
      title: 'Reposicao de gondolas - fim de semana',
      description:
        'Reposicao completa das gondolas do setor de bebidas durante o fim de semana de maior movimento.',
      date: twoWeeksAgo,
      startTime: '07:00',
      endTime: '15:00',
      hourlyRate: 20.0,
      estimatedHours: 8.0,
      totalAmount: 160.0,
      requiredSkills: ['REPOSITOR'],
      address: 'Rua Galvao Bueno, 300',
      lat: -23.5575,
      lng: -46.6353,
      status: 'ACCEPTED',
      expiresAt: twoWeeksAgo,
    },
  })

  const checkInTime = new Date(twoWeeksAgo)
  checkInTime.setHours(7, 2, 0, 0)

  const checkOutTime = new Date(twoWeeksAgo)
  checkOutTime.setHours(15, 5, 0, 0)

  // Job 2: COMPLETED
  const job2 = await prisma.job.create({
    data: {
      proposalId: completedProposal.id,
      workerId: worker1.id,
      marketId: market1.id,
      checkInAt: checkInTime,
      checkOutAt: checkOutTime,
      workerLat: -23.5576,
      workerLng: -46.6354,
      status: 'COMPLETED',
      notes:
        'Trabalho realizado com excelencia. Gondolas repostas antes do horario previsto.',
    },
  })

  console.log('  Created 2 jobs')

  // ---------------------------------------------------
  // Payment (1 completed payment for job2)
  // ---------------------------------------------------
  const paidAt = new Date(twoWeeksAgo)
  paidAt.setDate(paidAt.getDate() + 1)

  await prisma.payment.create({
    data: {
      jobId: job2.id,
      workerId: worker1.id,
      marketId: market1.id,
      amount: 160.0,
      platformFee: 16.0,
      workerAmount: 144.0,
      externalId: 'abacate_pay_txn_abc123def456',
      pixKey: 'carlos.silva@email.com',
      status: 'PAID',
      paidAt,
    },
  })

  console.log('  Created 1 payment')

  // ---------------------------------------------------
  // Reviews (2 reviews for the completed job)
  // ---------------------------------------------------

  // Market reviews worker (MARKET_TO_WORKER)
  await prisma.review.create({
    data: {
      jobId: job2.id,
      reviewerId: marketUser1.id,
      revieweeId: workerUser1.id,
      type: 'MARKET_TO_WORKER',
      rating: 5,
      comment:
        'Carlos foi muito profissional e eficiente. Reposicao feita com cuidado e antes do prazo. Recomendo!',
    },
  })

  // Worker reviews market (WORKER_TO_MARKET)
  await prisma.review.create({
    data: {
      jobId: job2.id,
      reviewerId: workerUser1.id,
      revieweeId: marketUser1.id,
      type: 'WORKER_TO_MARKET',
      rating: 4,
      comment:
        'Mercado bem organizado, equipe receptiva. Apenas o vestiario poderia ser melhor.',
    },
  })

  console.log('  Created 2 reviews')

  // ---------------------------------------------------
  // Summary
  // ---------------------------------------------------
  const counts = {
    users: await prisma.user.count(),
    workers: await prisma.worker.count(),
    markets: await prisma.market.count(),
    availabilities: await prisma.availability.count(),
    proposals: await prisma.proposal.count(),
    jobs: await prisma.job.count(),
    payments: await prisma.payment.count(),
    reviews: await prisma.review.count(),
  }

  console.log('\nSeed completed successfully!')
  console.log('Summary:', counts)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
