'use client'

import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useToast } from '@/components/ui/Toast'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Bell, BellOff, Info, Check, ShieldAlert } from 'lucide-react'

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
      <Card className="border-border-primary bg-surface/50 backdrop-blur-md">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <BellOff className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Push Notifications Unsupported</h3>
            <p className="text-text-muted text-sm">
              Your browser or device does not support Web Push notifications. Use a modern browser (Chrome, Safari, Edge, or Firefox) on HTTPS.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-md shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-xl shrink-0 transition-all duration-300 ${
              status === 'subscribed' 
                ? 'bg-success/10 text-success shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : status === 'denied' 
                ? 'bg-red-500/10 text-red-400' 
                : 'bg-primary/10 text-primary animate-pulse'
            }`}>
              {status === 'subscribed' ? (
                <Bell className="w-6 h-6" />
              ) : status === 'denied' ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <Bell className="w-6 h-6 text-accent" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-white font-semibold text-base">Mobile & Desktop Alerts</h3>
                {status === 'subscribed' ? (
                  <Badge variant="success" className="text-xs font-semibold py-0.5 px-2">
                    <Check className="w-3 h-3 mr-1 inline" /> Active
                  </Badge>
                ) : status === 'denied' ? (
                  <Badge variant="danger" className="text-xs font-semibold py-0.5 px-2">
                    Blocked
                  </Badge>
                ) : (
                  <Badge className="bg-white/10 text-text-muted text-xs font-semibold py-0.5 px-2">
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
                Receive instant notifications on your mobile device or desktop when users submit new events, hustles, gigs, or products. Works even when your browser is closed.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            {status === 'subscribed' ? (
              <Button 
                variant="outline" 
                onClick={handleUnsubscribe}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl bg-transparent text-white border-white/20 hover:bg-white/5 transition-all duration-200"
              >
                Disable Alerts
              </Button>
            ) : status === 'denied' ? (
              <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/5 px-3 py-2 rounded-xl border border-red-500/10">
                <Info className="w-4 h-4 shrink-0" />
                <span>Enable notifications in browser settings</span>
              </div>
            ) : (
              <Button 
                variant="accent" 
                onClick={handleSubscribe}
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-accent/15"
              >
                {status === 'loading' ? 'Enabling...' : 'Enable Alerts'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
