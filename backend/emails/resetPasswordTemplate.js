export const resetPasswordTemplate = (name, link) => `
  <div style="font-family:'Segoe UI',sans-serif">
    <h2>Hi ${name},</h2>
    <p>You requested to reset your password.</p>
    <p>Click the link below to set a new password:</p>

    <a href="${link}" 
       style="background:#2563eb;color:white;padding:10px 18px;text-decoration:none;border-radius:6px;">
       Reset Password
    </a>

    <p style="margin-top:20px;">If you didn’t request this, please ignore.</p>
  </div>
`;
