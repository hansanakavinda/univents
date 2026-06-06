'use server'

import { hash, compare } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { PasswordResetEmail } from '@/components/auth/PasswordResetEmail'
import { EmailVerificationEmail } from '@/components/auth/EmailVerificationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const senderEmail = process.env.EMAIL_SENDER

const SALT_ROUNDS = 10
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour
const VERIFICATION_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour


// ---------------------------------------------------------------------------
// Password Hashing
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

// ---------------------------------------------------------------------------
// Reset Token Generation
// ---------------------------------------------------------------------------

/**
 * Creates a unique password-reset token, stores it in the DB with a 1-hour
 * expiry, and returns the token string.
 *
 * If an existing token for this email exists, it is replaced (upsert-like
 * behavior via delete-then-create) to prevent token accumulation.
 */
export async function generateResetToken(email: string): Promise<string> {
  const token = randomUUID()
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)

  // Remove any existing token for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  })

  return token
}

// ---------------------------------------------------------------------------
// Reset Email Dispatch
// ---------------------------------------------------------------------------

export async function sendResetEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: `Univents Team <${senderEmail}>`,
    to: email,
    subject: 'Reset your Univents password',
    react: PasswordResetEmail({ resetLink }),
  })
}

// ---------------------------------------------------------------------------
// Verification Token Generation
// ---------------------------------------------------------------------------

export async function generateVerificationToken(email: string): Promise<string> {
  const token = randomUUID()
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS)

  // Remove any existing verification token for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

// ---------------------------------------------------------------------------
// Verification Email Dispatch
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL
  const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: `Univents Team <${senderEmail}>`,
    to: email,
    subject: 'Verify your Univents email address',
    react: EmailVerificationEmail({ verificationLink }),
  })
}

