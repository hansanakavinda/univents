import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const ForgotPasswordFallback = () => (
  <div className="w-full max-w-md p-8 space-y-4 animate-pulse">
    <div className="h-12 bg-stone-200 rounded-lg w-3/4 mx-auto" />
    <div className="h-48 bg-stone-100 rounded-xl" />
  </div>
)

export default async function ForgotPasswordPage() {
  const session = await getSession()
  if (session) {
    redirect('/events')
  }

  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
