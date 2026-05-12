/**
 * lib/webpush.ts — SERVER ONLY
 *
 * All web-push imports and VAPID configuration live here so this
 * module is never bundled into the client JavaScript.
 *
 * Usage:
 *   import { sendPushToAll } from '@/lib/webpush'
 *   await sendPushToAll({ title, body, url })
 */

import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

// ----------------------------------------------------------------
// Lazy VAPID initialization
// Called once on the first push request, not at module load time.
// This prevents build failures when VAPID keys are absent from the
// Docker build environment (they are only needed at runtime).
// ----------------------------------------------------------------

let vapidInitialized = false

function ensureVapidInitialized(): void {
  if (vapidInitialized) return

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    throw new Error(
      '[webpush] VAPID keys are not configured. ' +
        'Run `npx web-push generate-vapid-keys` and set NEXT_PUBLIC_VAPID_PUBLIC_KEY ' +
        'and VAPID_PRIVATE_KEY in your environment.'
    )
  }

  webpush.setVapidDetails('mailto:auth@univents.com.lk', publicKey, privateKey)
  vapidInitialized = true
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface PushPayload {
  title: string
  body: string
  url: string
  icon?: string
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/**
 * Send a push notification to a single subscription.
 * Returns true on success, false on any error.
 * Callers should handle 410 Gone (subscription expired) themselves.
 */
export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
): Promise<{ ok: boolean; gone: boolean }> {
  ensureVapidInitialized()
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload)
    )
    return { ok: true, gone: false }
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 410 || status === 404) {
      // The browser has invalidated this subscription
      return { ok: false, gone: true }
    }
    console.error('[webpush] Failed to send notification:', err)
    return { ok: false, gone: false }
  }
}

/**
 * Fan out a push notification to every stored subscription.
 * Subscriptions that return HTTP 410 (Gone) are deleted from the DB
 * automatically — the user has revoked browser permission.
 *
 * This function is fire-and-forget safe: it never throws.
 */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  try {
    ensureVapidInitialized()
  } catch (err) {
    console.error('[webpush] VAPID not configured — skipping push:', err)
    return
  }

  let subscriptions: { endpoint: string; p256dh: string; auth: string }[]

  try {
    subscriptions = await prisma.pushSubscription.findMany({
      select: { endpoint: true, p256dh: true, auth: true },
    })
  } catch (err) {
    console.error('[webpush] Failed to fetch subscriptions from DB:', err)
    return
  }

  if (subscriptions.length === 0) return

  const results = await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  )

  // Collect expired endpoints to delete in one batch query
  const expiredEndpoints: string[] = []
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.gone) {
      expiredEndpoints.push(subscriptions[i].endpoint)
    }
  })

  if (expiredEndpoints.length > 0) {
    await prisma.pushSubscription
      .deleteMany({ where: { endpoint: { in: expiredEndpoints } } })
      .catch((err) => console.error('[webpush] Failed to clean expired subscriptions:', err))

    console.log(`[webpush] Removed ${expiredEndpoints.length} expired subscription(s).`)
  }
}
