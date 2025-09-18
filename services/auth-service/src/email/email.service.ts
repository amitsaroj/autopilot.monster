import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter() {
    try {
      const smtpConfig = this.configService.get('email.smtp');
      
      if (!smtpConfig || !smtpConfig.user || !smtpConfig.password) {
        this.logger.warn('Email configuration incomplete - email service will be disabled');
        return;
      }
      
      this.transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password,
        },
      });

      this.transporter.verify((error, success) => {
        if (error) {
          this.logger.warn('SMTP connection failed (email service will be disabled):', error.message);
        } else {
          this.logger.log('SMTP connection established');
        }
      });
    } catch (error) {
      this.logger.warn('Failed to initialize email transporter:', error.message);
    }
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    
    try {
      const templateFiles = fs.readdirSync(templatesDir);
      
      templateFiles.forEach(file => {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf8');
          const template = handlebars.compile(templateContent);
          this.templates.set(templateName, template);
        }
      });
      
      this.logger.log(`Loaded ${this.templates.size} email templates`);
    } catch (error) {
      this.logger.warn('Could not load email templates:', error.message);
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('Email service not available - email not sent');
      return false;
    }

    try {
      const mailOptions = {
        from: this.configService.get('email.from'),
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error.message);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get('app.frontendUrl')}/verify-email?token=${token}`;
    
    const template = this.templates.get('verification') || this.getDefaultVerificationTemplate();
    const html = template({
      email,
      verificationUrl,
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
    });

    return await this.sendEmail(
      email,
      'Verify Your Email Address',
      html
    );
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${this.configService.get('app.frontendUrl')}/reset-password?token=${token}`;
    
    const template = this.templates.get('password-reset') || this.getDefaultPasswordResetTemplate();
    const html = template({
      email,
      resetUrl,
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
    });

    return await this.sendEmail(
      email,
      'Reset Your Password',
      html
    );
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const template = this.templates.get('welcome') || this.getDefaultWelcomeTemplate();
    const html = template({
      firstName,
      email,
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
      dashboardUrl: `${this.configService.get('app.frontendUrl')}/dashboard`,
    });

    return await this.sendEmail(
      email,
      'Welcome to Autopilot.Monster!',
      html
    );
  }

  async sendPasswordChangedEmail(email: string, firstName: string): Promise<boolean> {
    const template = this.templates.get('password-changed') || this.getDefaultPasswordChangedTemplate();
    const html = template({
      firstName,
      email,
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
      supportUrl: `${this.configService.get('app.frontendUrl')}/support`,
    });

    return await this.sendEmail(
      email,
      'Password Changed Successfully',
      html
    );
  }

  async sendAccountLockedEmail(email: string, firstName: string, unlockTime: Date): Promise<boolean> {
    const template = this.templates.get('account-locked') || this.getDefaultAccountLockedTemplate();
    const html = template({
      firstName,
      email,
      unlockTime: unlockTime.toLocaleString(),
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
      supportUrl: `${this.configService.get('app.frontendUrl')}/support`,
    });

    return await this.sendEmail(
      email,
      'Account Temporarily Locked',
      html
    );
  }

  async sendSuspiciousActivityEmail(email: string, firstName: string, activity: string): Promise<boolean> {
    const template = this.templates.get('suspicious-activity') || this.getDefaultSuspiciousActivityTemplate();
    const html = template({
      firstName,
      email,
      activity,
      appName: this.configService.get('app.name', 'Autopilot.Monster'),
      securityUrl: `${this.configService.get('app.frontendUrl')}/security`,
    });

    return await this.sendEmail(
      email,
      'Suspicious Activity Detected',
      html
    );
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  private getDefaultVerificationTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for registering with {{appName}}. Please click the link below to verify your email address:</p>
      <p><a href="{{verificationUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>{{verificationUrl}}</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }

  private getDefaultPasswordResetTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>You requested to reset your password for {{appName}}. Click the link below to reset your password:</p>
      <p><a href="{{resetUrl}}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>{{resetUrl}}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }

  private getDefaultWelcomeTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Welcome to {{appName}}!</h2>
      <p>Hello {{firstName}},</p>
      <p>Welcome to {{appName}}! We're excited to have you on board.</p>
      <p>You can now access your dashboard and start exploring our AI automation platform:</p>
      <p><a href="{{dashboardUrl}}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }

  private getDefaultPasswordChangedTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Password Changed Successfully</h2>
      <p>Hello {{firstName}},</p>
      <p>Your password has been successfully changed for your {{appName}} account.</p>
      <p>If you made this change, no further action is required.</p>
      <p>If you didn't make this change, please contact our support team immediately.</p>
      <p><a href="{{supportUrl}}" style="background-color: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a></p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }

  private getDefaultAccountLockedTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Account Temporarily Locked</h2>
      <p>Hello {{firstName}},</p>
      <p>Your {{appName}} account has been temporarily locked due to multiple failed login attempts.</p>
      <p>Your account will be automatically unlocked at: {{unlockTime}}</p>
      <p>If you believe this is an error, please contact our support team.</p>
      <p><a href="{{supportUrl}}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a></p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }

  private getDefaultSuspiciousActivityTemplate(): HandlebarsTemplateDelegate {
    return handlebars.compile(`
      <h2>Suspicious Activity Detected</h2>
      <p>Hello {{firstName}},</p>
      <p>We detected suspicious activity on your {{appName}} account:</p>
      <p><strong>{{activity}}</strong></p>
      <p>If this was you, no further action is required.</p>
      <p>If this wasn't you, please secure your account immediately:</p>
      <p><a href="{{securityUrl}}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Secure Account</a></p>
      <p>Best regards,<br>The {{appName}} Team</p>
    `);
  }
}