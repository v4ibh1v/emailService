// src/EmailService.ts

import { IEmailProvider } from './MockEmailProvider';
import { retryWithExponentialBackoff } from './Retry';
import { RateLimiter } from './RateLimiter';
import { StatusTracker } from './StatusTracker';

export class EmailService {
  private providers: IEmailProvider[];
  private rateLimiter: RateLimiter;
  private statusTracker: StatusTracker;

  constructor(providers: IEmailProvider[], rateLimiter: RateLimiter, statusTracker: StatusTracker) {
    this.providers = providers;
    this.rateLimiter = rateLimiter;
    this.statusTracker = statusTracker;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const emailId = `${to}:${subject}`;

    // Avoid duplicate sends
    const existingStatus = this.statusTracker.getStatus(emailId);
    if (existingStatus === 'SUCCESS') {
      console.log(`⚠️ Email already sent successfully to ${to}. Skipping.`);
      this.statusTracker.setStatus(emailId, 'SKIPPED');
      return;
    }

    // Rate limiting
    if (!this.rateLimiter.allow()) {
      this.statusTracker.setStatus(emailId, 'SKIPPED');
      console.log(`⛔ Rate limit hit. Skipping email to ${to}`);
      return;
    }

    for (const provider of this.providers) {
      try {
        this.statusTracker.setStatus(emailId, 'RETRYING');
        
        const result = await retryWithExponentialBackoff(() =>
          provider.sendEmail(to, subject, body)
        );

        if (result) {
          this.statusTracker.setStatus(emailId, 'SUCCESS');
          console.log(`✅ Email sent successfully to ${to}`);
          return;
        } else {
          throw new Error("Provider returned false");
        }
      } catch (error) {
        console.log(`❌ Failed with one provider, trying next...`);
      }
    }

    this.statusTracker.setStatus(emailId, 'FAILED');
    console.log(`❌ All providers failed to send email to ${to}`);
  }

  getStatuses() {
    return this.statusTracker.getAllStatuses();
  }
}
