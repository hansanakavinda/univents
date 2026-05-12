/**
 * POST /api/push/notify
 *
 * Internal route: called server-side only (from the moderation route)
 * after an event is approved. Fans out a push notification to all
 * stored subscriptions via lib/webpush.ts.
 *
 * This route is NOT meant to be called directly from the browser.
 * It is secured by an internal secret header to prevent abuse.
 *
 * Body: { title: string, body: string, url: string }
 */

import { NextResponse } from 'next/server'
import { asyncCatcher, validateRequest, ApiError } from '@/lib/api/api-utils'
import { sendPushToAll } from '@/lib/webpush'
import { z } from 'zod'

const notifySchema = z.object({
  title: z.string().min(1),
  body: z.string(),
  url: z.string(),
})

export const POST = asyncCatcher(async (request: Request) => {
  // Guard: only allow calls with the internal secret header
  const internalSecret = request.headers.get('x-internal-secret')
  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    throw new ApiError('Forbidden', 403)
  }

  const { title, body, url } = await validateRequest(request, notifySchema)

  // Fire-and-forget — do not await here so the moderation response is not delayed
  sendPushToAll({ title, body, url, icon: '/icon.png' }).catch((err) =>
    console.error('[push/notify] Unhandled error during push fan-out:', err)
  )

  return NextResponse.json({ success: true })
}, 'Push notify')
