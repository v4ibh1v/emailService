import { EmailService } from './EmailService';
import { StatusTracker } from './StatusTracker';
import { RateLimiter } from './RateLimiter';
import { retryWithExponentialBackoff } from './Retry';
import { MockEmailProvider1, MockEmailProvider2 } from './MockEmailProvider';

// Create instance of EmailService with 2 providers, 5 emails per 60 seconds
const emailService = new EmailService(
  [new MockEmailProvider1(), new MockEmailProvider2()],
  new RateLimiter(5, 60000),
  new StatusTracker()
);

// Sample email sending
(async () => {
  try {
    await emailService.sendEmail('test@example.com', 'Test Subject', 'Hello from the email service!');
    console.log('✅ Email sent!');
  } catch (err: any) {
    console.error('❌ Email failed:', err.message);
  }
})();
