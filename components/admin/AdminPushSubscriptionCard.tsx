'use client'

import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Bell, BellOff, ShieldAlert, Loader2 } from 'lucide-react'

export function AdminPushSubscriptionCard() {
  const { status, subscribe, unsubscribe } = usePushNotifications()
  const toast = useToast()

  const handleSubscribe = async () => {
    try {
      await subscribe()
      toast.success('Push notifications successfully enabled on this device!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to enable push notifications.')
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe()
      toast.info('Notifications disabled on this device.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to disable push notifications.')
    }
  }

  if (status === 'unsupported') {
    return (
      <div className="flex items-center gap-1.5 text-text-muted text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
        <BellOff className="w-3.5 h-3.5" />
        <span>Push Unsupported</span>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2 text-xs py-1 px-3 border-white/10 text-text-muted">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Updating...</span>
      </Button>
    )
  }

  if (status === 'subscribed') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnsubscribe}
        className="gap-2 text-xs py-1 px-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-200 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
      >
        <Bell className="w-3.5 h-3.5 fill-current" />
        <span>Alerts Active</span>
      </Button>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex items-center gap-1.5 text-red-400 text-xs bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10">
        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
        <span>Alerts Blocked</span>
      </div>
    )
  }

  return (
    <Button
      variant="accent"
      size="sm"
      onClick={handleSubscribe}
      className="gap-2 text-xs py-1.5 px-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-accent/10"
    >
      <Bell className="w-3.5 h-3.5 text-white" />
      <span className="text-white">Enable Alerts</span>
    </Button>
  )
}
