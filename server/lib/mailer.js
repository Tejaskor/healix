import nodemailer from 'nodemailer'

// Build a Gmail SMTP transporter using credentials from .env.
// The password MUST be a Google App Password (not the real account password).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Verify once at startup so config errors surface immediately.
transporter.verify((err) => {
  if (err) {
    console.error('[mailer] SMTP verify failed:', err.message)
  } else {
    console.log('[mailer] SMTP ready')
  }
})

export const sendResetEmail = async ({ to, resetLink }) => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER
  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Reset Your Password',
    text: [
      'We received a request to reset your Healix password.',
      '',
      'Click the link below to set a new password. The link expires in 15 minutes.',
      resetLink,
      '',
      'If you did not request this, you can safely ignore this email.',
    ].join('\n'),
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#1A362D; margin:0 0 12px;">Reset your password</h2>
        <p style="color:#333; line-height:1.5;">We received a request to reset your Healix password. Click the button below to set a new one. This link expires in <strong>15 minutes</strong>.</p>
        <p style="text-align:center; margin: 24px 0;">
          <a href="${resetLink}" style="background:#1A362D;color:#FAEAAC;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;display:inline-block;">Reset password</a>
        </p>
        <p style="color:#666; font-size:13px; line-height:1.5;">Or copy and paste this link into your browser:<br><a href="${resetLink}" style="color:#1A362D;">${resetLink}</a></p>
        <p style="color:#888; font-size:12px; line-height:1.5; margin-top:24px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
      </div>
    `,
  })
  return info
}
