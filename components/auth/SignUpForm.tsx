'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpInput } from '@/lib/validators/auth'
import { signUpAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    setServerMessage(null)

    try {
      const result = await signUpAction(data)

      if (result.success) {
        setServerMessage({ type: 'success', text: result.message })
        reset()
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
          <p className="text-text-muted">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>

          <CardContent>
            {serverMessage?.type === 'success' ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-green-900/30 border border-green-800/30 text-green-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                  </svg>
                  <p className="text-sm font-medium">{serverMessage.text}</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex w-full justify-center py-2.5 px-4 text-center text-sm font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                >
                  Go to Sign In
                </Link>
              </div>
            ) : (
              <>
                {/* Server Messages */}
                {serverMessage && (
                  <div className="mb-4 p-3 rounded-xl border bg-red-900/30 border-red-800/30 text-red-400">
                    <p className="text-sm">{serverMessage.text}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    disabled={isLoading}
                    {...register('name')}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    disabled={isLoading}
                    {...register('email')}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    disabled={isLoading}
                    {...register('password')}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                {/* Link to login */}
                <p className="text-center text-sm text-text-muted mt-6">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
