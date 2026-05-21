/**
 * POST /api/push/subscribe
 *
 * Receives a serialized PushSubscription object from the browser and
 * upserts it into the database. Called from the usePushNotifications hook.
 *
 * Body: { endpoint: string, keys: { p256dh: string, auth: string } }
 */

import { NextResponse } from 'next/server'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
})

export const POST = asyncCatcher(async (request: Request) => {
  const { endpoint, keys } = await validateRequest(request, subscribeSchema)

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    update: {
      // Keys can rotate — always keep them current
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  })

  return NextResponse.json({ success: true })
}, 'Push subscribe')

export const DELETE = asyncCatcher(async (request: Request) => {
  const url = new URL(request.url)
  const endpoint = url.searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 })
  }

  await prisma.pushSubscription.deleteMany({
    where: { endpoint },
  })

  return NextResponse.json({ success: true })
}, 'Push unsubscribe')
