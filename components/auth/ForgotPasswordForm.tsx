'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators/auth'
import { requestResetAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    setServerMessage(null)

    try {
      const result = await requestResetAction(data)

      if (result.success) {
        setServerMessage({ type: 'success', text: result.message })
      } else {
        setServerMessage({ type: 'error', text: result.message })
      }
    } catch {
      setServerMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Univents</h1>
          <p className="text-text-muted">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Server Messages */}
            {serverMessage && (
              <div
                className={`mb-4 p-3 rounded-xl border ${
                  serverMessage.type === 'success'
                    ? 'bg-green-900/30 border-green-800/30 text-green-400'
                    : 'bg-red-900/30 border-red-800/30 text-red-400'
                }`}
              >
                <p className="text-sm">{serverMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                disabled={isLoading}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            {/* Back to login */}
            <p className="text-center text-sm text-text-muted mt-6">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
