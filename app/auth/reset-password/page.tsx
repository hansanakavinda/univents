import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const ResetPasswordFallback = () => (
  <div className="w-full max-w-md p-8 space-y-4 animate-pulse">
    <div className="h-12 bg-surface rounded-lg w-3/4 mx-auto" />
    <div className="h-56 bg-card rounded-xl" />
  </div>
)

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const session = await getSession()
  if (session) {
    redirect('/events')
  }

  const { token } = await searchParams

  if (!token) {
    redirect('/auth/forgot-password')
  }

  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm token={token} />
    </Suspense>
  )
}
