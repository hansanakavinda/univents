// ============================================================
// Univents Service Worker — Web Push Notification Handler
// ============================================================
// Served at /sw.js from the public directory so its scope
// covers the entire origin.

/**
 * Handle incoming push messages from the server.
 * The server sends JSON: { title, body, url, icon? }
 */
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'New Event on Univents', body: event.data.text(), url: '/' }
  }

  const { title = 'New Event on Univents', body = '', url = '/', icon = '/icon.png' } = payload

  const options = {
    body,
    icon,
    badge: '/icon.png',
    data: { url },
    // Show notification even if the page is currently focused
    requireInteraction: false,
    // Vibration pattern (ms): vibrate, pause, vibrate
    vibrate: [200, 100, 200],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

/**
 * Handle notification click — open the event page in a focused tab.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If a tab with this URL already exists, focus it
        for (const client of windowClients) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus()
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl)
        }
      })
  )
})
