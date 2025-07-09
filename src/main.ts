import { EmailService } from './EmailService';
import { StatusTracker } from './StatusTracker';
import { RateLimiter } from './RateLimiter';
import { retryWithExponentialBackoff } from './Retry';
import { MockEmailProvider1 } from './MockEmailProvider';

const emailService = new EmailService(
  [new MockEmailProvider()],
  new RateLimiter(5, 60000), // 5 emails per 60 seconds
  new Retry(3),
  new StatusTracker()
);

// Sample email sending
(async () => {
  try {
    await emailService.sendEmail('test@example.com', 'Test Subject', 'Hello from the email service!');
    console.log('✅ Email sent!');
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
})();
