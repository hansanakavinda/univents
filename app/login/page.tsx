import { LoginForm } from '../../components/auth/LoginForm'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const LoginFallback = () => (
  <div className='flex items-center justify-center h-screen'>
    <div className="w-full max-w-md p-8 space-y-4 animate-pulse">
      <div className="h-12 bg-surface rounded-lg w-3/4 mx-auto" />
      <div className="h-64 bg-card rounded-xl" />
    </div>
  </div>
);

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}