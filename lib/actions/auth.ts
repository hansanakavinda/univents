'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, generateVerificationToken, sendVerificationEmail } from '@/lib/auth-utils'
import { generateResetToken, sendResetEmail } from '@/lib/auth-utils'
import { signUpSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validators/auth'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActionResult {
  success: boolean
  message: string
}

// ---------------------------------------------------------------------------
// Sign Up
// ---------------------------------------------------------------------------

export async function signUpAction(rawData: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<ActionResult> {
  try {
    // 1. Validate
    const parsed = signUpSchema.safeParse(rawData)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return { success: false, message: firstError.message }
    }

    const { name, email, password } = parsed.data

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, authProvider: true, emailVerified: true },
    })

    if (existingUser) {
      if (existingUser.authProvider === 'GOOGLE') {
        return {
          success: false,
          message: 'This email is registered with Google. Please sign in with Google instead.',
        }
      }
      
      // If the account exists and is already verified
      if (existingUser.emailVerified) {
        return { success: false, message: 'An account with this email already exists.' }
      }

      // If the account is NOT verified, overwrite & resend (User's choice A1)
      const hashedPassword = await hashPassword(password)
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          password: hashedPassword,
        },
      })

      const token = await generateVerificationToken(email)
      await sendVerificationEmail(email, token)

      return {
        success: true,
        message: 'A new verification link has been sent to your email. Please check your inbox.',
      }
    }

    // 3. Hash password and create user
    const hashedPassword = await hashPassword(password)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        authProvider: 'MANUAL',
        role: 'USER',
        isActive: true,
        emailVerified: null, // ensure it defaults to null
      },
    })

    const token = await generateVerificationToken(email)
    await sendVerificationEmail(email, token)

    return {
      success: true,
      message: 'Account created! Please check your email for a verification link to complete registration.',
    }
  } catch (error) {
    console.error('[signUpAction] Error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}


// ---------------------------------------------------------------------------
// Request Password Reset
// ---------------------------------------------------------------------------

/**
 * SECURITY: Always returns a success message regardless of whether the email
 * exists. This prevents email enumeration attacks.
 */
export async function requestResetAction(rawData: {
  email: string
}): Promise<ActionResult> {
  try {
    // 1. Validate
    const parsed = forgotPasswordSchema.safeParse(rawData)
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message }
    }

    const { email } = parsed.data

    // 2. Check if user exists with MANUAL auth
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, authProvider: true },
    })

    // Only send reset email for MANUAL users that actually exist
    if (user && user.authProvider === 'MANUAL') {
      const token = await generateResetToken(email)
      await sendResetEmail(email, token)
    }

    // 3. Always return success (prevent email enumeration)
    return {
      success: true,
      message:
        'If an account exists with that email, you will receive a password reset link shortly.',
    }
  } catch (error) {
    console.error('[requestResetAction] Error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    }
  }
}

// ---------------------------------------------------------------------------
// Reset Password
// ---------------------------------------------------------------------------

export async function resetPasswordAction(rawData: {
  token: string
  password: string
  confirmPassword: string
}): Promise<ActionResult> {
  try {
    // 1. Validate
    const parsed = resetPasswordSchema.safeParse(rawData)
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message }
    }

    const { token, password } = parsed.data

    // 2. Find the token in DB
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return { success: false, message: 'Invalid or expired reset link. Please request a new one.' }
    }

    // 3. Check expiry
    if (new Date() > resetToken.expires) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
      return { success: false, message: 'This reset link has expired. Please request a new one.' }
    }

    // 4. Hash new password and update user
    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    // 5. SECURITY: Delete token immediately (single-use)
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return { success: true, message: 'Password reset successfully! You can now sign in.' }
  } catch (error) {
    console.error('[resetPasswordAction] Error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// Verify Email
// ---------------------------------------------------------------------------

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return { success: false, message: 'Invalid or expired verification link.' }
    }

    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return {
        success: false,
        message: 'This verification link has expired. Please request a new one.',
      }
    }

    // Update user to verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete token (single-use)
    await prisma.verificationToken.delete({
      where: { token },
    })

    return { success: true, message: 'Email verified successfully! You can now sign in.' }
  } catch (error) {
    console.error('[verifyEmailAction] Error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// Resend Verification Link
// ---------------------------------------------------------------------------

export async function resendVerificationAction(email: string): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true, authProvider: true },
    })

    if (!user) {
      return { success: false, message: 'No account found with this email.' }
    }

    if (user.authProvider !== 'MANUAL') {
      return {
        success: false,
        message: 'This email is registered with Google. Please sign in using Google.',
      }
    }

    if (user.emailVerified) {
      return { success: true, message: 'This email is already verified. You can sign in.' }
    }

    const token = await generateVerificationToken(email)
    await sendVerificationEmail(email, token)

    return {
      success: true,
      message: 'Verification link resent! Please check your email inbox.',
    }
  } catch (error) {
    console.error('[resendVerificationAction] Error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

