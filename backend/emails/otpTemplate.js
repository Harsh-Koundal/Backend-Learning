export const otpTemplate = (name, otp) => `
  <div style="font-family:'Segoe UI',sans-serif">
    <h2>Hello ${name},</h2>
    <p>Your OTP is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This OTP is valid for 5 minutes.</p>
  </div>
`;
