const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  // Use console output if email credentials are not configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not configured, using console output for OTP');
    return null; // Will trigger console output mode
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const transporter = createTransporter();

    const subject = purpose === 'login' ? 'Login OTP - NoAI Backend' : 'Email Verification OTP - NoAI Backend';
    const message = purpose === 'login' 
      ? `Your login OTP is: ${otp}. This OTP will expire in 10 minutes.`
      : `Your email verification OTP is: ${otp}. This OTP will expire in 10 minutes.`;

    // If no transporter (email not configured), log to console for development
    if (!transporter) {
      console.log('\n=== OTP EMAIL (Development Mode) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`OTP: ${otp}`);
      console.log('=====================================\n');
      return { success: true, messageId: 'console-output', mode: 'development' };
    }

    const mailOptions = {
      from: `"NoAI Backend" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">NoAI Backend</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 15px;">${purpose === 'login' ? 'Login Verification' : 'Email Verification'}</h3>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 14px; text-align: center;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId, mode: 'email' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};