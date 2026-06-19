import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  to: string,
  verificationToken: string
) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Verify your account ✔",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Account</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:#111827;padding:20px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;">My App</h1>
    </div>
    <!-- Body -->
    <div style="padding:30px;text-align:center;">
      <h2 style="color:#111827;">Verify your email address</h2>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;">
        Thanks for signing up! Please confirm your email address to activate your account.
      </p>
      <a
  href="${verifyUrl}"
  target="_blank"
  style="
    display:inline-block;
    margin-top:20px;
    padding:12px 24px;
    background:#facc15;
    color:#111827;
    text-decoration:none;
    font-weight:bold;
    border-radius:8px;
    mso-padding-alt:0;
  "
>
  Verify Account
</a>

      <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
        If the button doesn't work, copy and paste this link:
      </p>

      <p style="font-size:12px;color:#3b82f6;word-break:break-all;">
        ${verifyUrl}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
      If you didn't create this account, you can safely ignore this email.
    </div>

  </div>

</body>
</html>
    `,
  });
}