'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyEmailAction, resendVerificationAction } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email address...')
  
  // States for resending
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token. Please make sure you clicked the full link in your email.')
      return
    }

    const verify = async () => {
      try {
        const result = await verifyEmailAction(token)
        if (result.success) {
          setStatus('success')
          setMessage(result.message)
        } else {
          setStatus('error')
          setMessage(result.message)
        }
      } catch (err) {
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    verify()
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setResendMessage({ type: 'error', text: 'Please enter your email address.' })
      return
    }

    setIsResending(true)
    setResendMessage(null)

    try {
      const result = await resendVerificationAction(email)
      if (result.success) {
        setResendMessage({ type: 'success', text: result.message })
      } else {
        setResendMessage({ type: 'error', text: result.message })
      }
    } catch (err) {
      setResendMessage({ type: 'error', text: 'Failed to resend email. Please try again.' })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Univents</h1>
          <p className="text-text-muted">Email Verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              {status === 'loading' && 'Checking token validity...'}
              {status === 'success' && 'Email verified!'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-10 h-10 border-4 border-t-accent border-border rounded-full animate-spin" />
                <p className="text-sm text-text-muted">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-green-900/30 border border-green-800/30 text-green-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">{message}</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex w-full justify-center py-2.5 px-4 text-center text-sm font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-red-900/30 border border-red-800/30 text-red-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">{message}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-white mb-2">Request a new verification link</h3>
                  
                  {resendMessage && (
                    <div className={`mb-3 p-3 rounded-xl border text-sm ${
                      resendMessage.type === 'success'
                        ? 'bg-green-900/30 border-green-800/30 text-green-400'
                        : 'bg-red-900/30 border-red-800/30 text-red-400'
                    }`}>
                      {resendMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleResend} className="space-y-3">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isResending}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isResending}
                    >
                      {isResending ? 'Sending Link...' : 'Send Verification Link'}
                    </Button>
                  </form>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-text-muted hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
