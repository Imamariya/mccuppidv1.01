import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

let transporter: any = null;

/**
 * Initialize email transporter
 * Supports both Gmail and SendGrid
 */
export const initEmailService = () => {
  const emailService = process.env.EMAIL_SERVICE || 'sendgrid';

  if (emailService === 'sendgrid') {
    // SendGrid configuration
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY || ''
      }
    });
  } else if (emailService === 'gmail') {
    // Gmail configuration
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD // Use app-specific password
      }
    });
  } else {
    // Development: use Ethereal Email (test service)
    console.warn('No email service configured. Using Ethereal for testing.');
  }
};

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!transporter) {
      initEmailService();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@mallucupid.com',
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  frontendUrl?: string
): Promise<boolean> => {
  const resetLink = `${frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset the password for your MalluCupid account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 4px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email.
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br/>The MalluCupid Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 MalluCupid. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request - MalluCupid',
    html: htmlContent
  });
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 Welcome to MalluCupid!</h1>
          </div>
          
          <div class="content">
            <p>Hello ${name},</p>
            
            <p>Welcome to MalluCupid! We're excited to have you join our community.</p>
            
            <p>Here's what you can do next:</p>
            <ul>
              <li>Complete your profile</li>
              <li>Upload your photos</li>
              <li>Start browsing matches</li>
              <li>Connect with other users</li>
            </ul>
            
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/profile" class="button">
                Complete Your Profile
              </a>
            </p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Happy matching!<br/>The MalluCupid Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 MalluCupid. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to MalluCupid!',
    html: htmlContent
  });
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<boolean> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .code-box {
            background-color: #f0f0f0;
            border: 2px solid #667eea;
            padding: 15px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Verification</h1>
          </div>
          
          <div class="content">
            <p>Thank you for signing up!</p>
            
            <p>Please enter the following verification code to verify your email address:</p>
            
            <div class="code-box">${verificationCode}</div>
            
            <p>This code will expire in 10 minutes.</p>
            
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 MalluCupid. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Email Verification Code - MalluCupid',
    html: htmlContent
  });
};
