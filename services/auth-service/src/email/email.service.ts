import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('email.smtp.host'),
      port: this.configService.get('email.smtp.port'),
      secure: this.configService.get('email.smtp.secure'),
      auth: {
        user: this.configService.get('email.smtp.user'),
        pass: this.configService.get('email.smtp.password'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get('frontend.url')}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: this.configService.get('email.from'),
        to: email,
        subject: 'Verify Your Email - Autopilot Monster',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Autopilot Monster!</h2>
            <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            ">Verify Email</a>
            <p>If you can't click the button, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
        `,
        text: `
          Welcome to Autopilot Monster!
          
          Thank you for registering with us. Please verify your email by visiting:
          ${verificationUrl}
          
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${this.configService.get('frontend.url')}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: this.configService.get('email.from'),
        to: email,
        subject: 'Reset Your Password - Autopilot Monster',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="
              display: inline-block;
              background-color: #dc3545;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            ">Reset Password</a>
            <p>If you can't click the button, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        `,
        text: `
          Password Reset Request
          
          We received a request to reset your password. Visit the following link to reset it:
          ${resetUrl}
          
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('email.from'),
        to: email,
        subject: 'Welcome to Autopilot Monster!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome ${firstName}!</h2>
            <p>Thank you for joining Autopilot Monster. We're excited to have you on board!</p>
            <p>Here are some things you can do to get started:</p>
            <ul>
              <li>Browse our marketplace of AI agents and workflows</li>
              <li>Upload your own AI agents and start earning</li>
              <li>Join our community of AI enthusiasts</li>
            </ul>
            <a href="${this.configService.get('frontend.url')}" style="
              display: inline-block;
              background-color: #28a745;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            ">Explore Marketplace</a>
            <p style="color: #666; font-size: 14px;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>
        `,
        text: `
          Welcome ${firstName}!
          
          Thank you for joining Autopilot Monster. We're excited to have you on board!
          
          Visit our marketplace: ${this.configService.get('frontend.url')}
          
          If you have any questions, feel free to contact our support team.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendSecurityAlert(email: string, alertType: string, details: any): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('email.from'),
        to: email,
        subject: `Security Alert - ${alertType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Security Alert: ${alertType}</h2>
            <p>We detected unusual activity on your account. Here are the details:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>Time:</strong> ${details.timestamp}<br>
              <strong>IP Address:</strong> ${details.ipAddress}<br>
              <strong>Location:</strong> ${details.location || 'Unknown'}<br>
              <strong>Device:</strong> ${details.userAgent || 'Unknown'}
            </div>
            <p>If this was you, no action is needed. If you don't recognize this activity, please:</p>
            <ul>
              <li>Change your password immediately</li>
              <li>Review your account settings</li>
              <li>Contact our support team</li>
            </ul>
            <p style="color: #666; font-size: 14px;">
              This is an automated security alert. Please do not reply to this email.
            </p>
          </div>
        `,
        text: `
          Security Alert: ${alertType}
          
          We detected unusual activity on your account.
          
          Time: ${details.timestamp}
          IP Address: ${details.ipAddress}
          Location: ${details.location || 'Unknown'}
          Device: ${details.userAgent || 'Unknown'}
          
          If this was you, no action is needed. If you don't recognize this activity, please change your password immediately.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Security alert email sent to: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send security alert email:', error);
      throw error;
    }
  }
}
