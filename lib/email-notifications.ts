import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { PendingApprovalEmail } from '@/components/admin/PendingApprovalEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const senderEmail = process.env.EMAIL_SENDER

export async function notifyAdminsNewContent(
  itemType: 'Event' | 'Hustle' | 'Gig' | 'Product',
  itemTitle: string
): Promise<void> {
  try {
    // 1. Fetch all active admins and super admins
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        isActive: true,
      },
      select: { email: true },
    })

    if (admins.length === 0) {
      console.log('[notifyAdminsNewContent] No active admins found to notify.')
      return
    }

    const recipientEmails = admins.map((admin) => admin.email)
    const baseUrl = process.env.NEXTAUTH_URL || 'https://univents.com.lk'
    const moderationLink = `${baseUrl}/admin/moderation`

    // 2. Dispatch emails in parallel
    const emailPromises = recipientEmails.map((email) =>
      resend.emails.send({
        from: `Univents Team <${senderEmail}>`,
        to: email,
        subject: `Pending Approval: New ${itemType} Submitted`,
        react: PendingApprovalEmail({ itemType, itemTitle, moderationLink }),
      })
    )

    const results = await Promise.allSettled(emailPromises)
    results.forEach((result, idx) => {
      if (result.status === 'rejected') {
        console.error(`[notifyAdminsNewContent] Failed to send email to ${recipientEmails[idx]}:`, result.reason)
      } else {
        console.log(`[notifyAdminsNewContent] Email sent successfully to ${recipientEmails[idx]}`)
      }
    })
  } catch (error) {
    console.error('[notifyAdminsNewContent] Error sending notifications:', error)
  }
}
