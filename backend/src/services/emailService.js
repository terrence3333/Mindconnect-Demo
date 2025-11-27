const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'MindConnect <noreply@mindconnect.org>',
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${options.email}`);
    } catch (error) {
      console.error('❌ Email send error:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Welcome to MindConnect! 🧠💚</h1>
        <p>Thank you for registering with MindConnect. Please verify your email address to get started.</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account with MindConnect, please ignore this email.
        </p>
      </div>
    `;

    await this.sendEmail({
      email,
      subject: 'Verify Your MindConnect Account',
      html
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    await this.sendEmail({
      email,
      subject: 'Reset Your MindConnect Password',
      html
    });
  }

  async sendAppointmentConfirmation(email, appointment) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Appointment Confirmed ✅</h1>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Type:</strong> ${appointment.type}</p>
        </div>
        <p>We'll send you a reminder 24 hours before your appointment.</p>
        <p style="color: #666; font-size: 14px;">
          Need to reschedule? Log in to your dashboard to manage your appointments.
        </p>
      </div>
    `;

    await this.sendEmail({
      email,
      subject: 'Appointment Confirmation - MindConnect',
      html
    });
  }
}

module.exports = new EmailService();
