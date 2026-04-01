import React from 'react'

interface PasswordResetEmailProps {
  resetLink: string
}

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '40px 20px',
        backgroundColor: '#FCFAF7',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px 32px',
          border: '1px solid #F5F5F4',
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#4B3621',
            margin: '0 0 8px',
            textAlign: 'center' as const,
          }}
        >
          Univents
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#6B6B6B',
            textAlign: 'center' as const,
            margin: '0 0 32px',
          }}
        >
          Password Reset Request
        </p>

        {/* Body */}
        <p style={{ fontSize: '15px', color: '#1F1F1F', lineHeight: '1.6', margin: '0 0 16px' }}>
          We received a request to reset your password. Click the button below to choose a new one:
        </p>

        <div style={{ textAlign: 'center' as const, margin: '24px 0' }}>
          <a
            href={resetLink}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#CC5500',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            Reset Password
          </a>
        </div>

        <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.5', margin: '0 0 8px' }}>
          This link will expire in <strong>1 hour</strong>. If you didn&apos;t request a password
          reset, you can safely ignore this email.
        </p>

        {/* Footer */}
        <hr style={{ border: 'none', borderTop: '1px solid #F5F5F4', margin: '24px 0' }} />
        <p style={{ fontSize: '12px', color: '#6B6B6B', textAlign: 'center' as const, margin: 0 }}>
          © {new Date().getFullYear()} Univents • univents.com.lk
        </p>
      </div>
    </div>
  )
}
