import { SignUpForm } from '@/components/auth/SignUpForm'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const SignUpFallback = () => (
  <div className="w-full max-w-md p-8 space-y-4 animate-pulse">
    <div className="h-12 bg-surface rounded-lg w-3/4 mx-auto" />
    <div className="h-80 bg-card rounded-xl" />
  </div>
)

export default async function SignUpPage() {
  const session = await getSession()
  if (session) {
    redirect('/events')
  }

  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpForm />
    </Suspense>
  )
}
