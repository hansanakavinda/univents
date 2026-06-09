'use client'

/**
 * hooks/usePushNotifications.ts
 *
 * React hook that manages Web Push Notification subscription lifecycle.
 *
 * - Registers /sw.js service worker on mount (inside useEffect, client-only)
 * - Reads the existing Notification permission state on load
 * - Exposes a `subscribe()` function that requests permission, subscribes
 *   via the Push API, and POSTs the result to /api/push/subscribe
 * - Gracefully no-ops when Notification or serviceWorker APIs are unavailable
 *   (e.g. Firefox private mode, non-HTTPS, server-side render)
 */

import { useState, useEffect, useCallback } from 'react'

export type PushStatus = 'idle' | 'loading' | 'subscribed' | 'denied' | 'unsupported'

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('idle')

  // ----------------------------------------------------------------
  // On mount: register the service worker and read permission state
  // ----------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }

    // Reflect current browser permission without prompting
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }

    // Register the service worker (idempotent — safe to call every render)
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(async (registration) => {
        // Check if already subscribed
        const existing = await registration.pushManager.getSubscription()
        if (existing) {
          setStatus('subscribed')
          // Sync with the backend to ensure the userId association is up to date
          fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(existing.toJSON()),
          }).catch((err) => {
            console.error('[usePushNotifications] Failed to sync existing subscription:', err)
          })
        }
      })
      .catch((err) => {
        console.error('[usePushNotifications] Service worker registration failed:', err)
      })
  }, [])

  // ----------------------------------------------------------------
  // subscribe() — called when the user clicks "Get Notified"
  // ----------------------------------------------------------------
  const subscribe = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }

    setStatus('loading')

    try {
      // 1. Request browser notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return
      }

      // 2. Get (or create) the service worker registration
      const registration = await navigator.serviceWorker.ready

      // 3. Convert the VAPID public key from base64url to Uint8Array
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error('[usePushNotifications] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set.')
        setStatus('idle')
        return
      }
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

      // 4. Subscribe via the Push API
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      // 5. Send the subscription to our API to persist in the DB
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pushSubscription.toJSON()),
      })

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }

      setStatus('subscribed')
    } catch (err) {
      console.error('[usePushNotifications] Subscription failed:', err)
      // Revert to idle so the user can try again (unless they explicitly denied)
      setStatus(Notification.permission === 'denied' ? 'denied' : 'idle')
    }
  }, [])

  // ----------------------------------------------------------------
  // unsubscribe() — called when the user disables notifications
  // ----------------------------------------------------------------
  const unsubscribe = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    setStatus('loading')
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        // Remove from DB
        await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'DELETE',
        })
        
        // Unsubscribe locally
        await subscription.unsubscribe()
      }
      
      setStatus('idle')
    } catch (err) {
      console.error('[usePushNotifications] Unsubscription failed:', err)
      setStatus('subscribed') // revert on failure
    }
  }, [])

  return { status, subscribe, unsubscribe }
}

// ----------------------------------------------------------------
// Utility: convert a base64url VAPID public key to an ArrayBuffer
// required by pushManager.subscribe(applicationServerKey).
//
// We allocate via `new Uint8Array(length)` to guarantee the backing
// buffer is a plain ArrayBuffer (never SharedArrayBuffer), which is
// what the Push API types require.
// ----------------------------------------------------------------
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const uint8Array = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    uint8Array[i] = rawData.charCodeAt(i)
  }
  return uint8Array.buffer as ArrayBuffer
}
