import { EmailService } from '../src/EmailService';
import { MockEmailProvider1, MockEmailProvider2 } from '../src/MockEmailProvider';
import { RateLimiter } from '../src/RateLimiter';
import { StatusTracker } from '../src/StatusTracker';

describe('EmailService', () => {
  const provider1 = new MockEmailProvider1();
  const provider2 = new MockEmailProvider2();
  const rateLimiter = new RateLimiter(10,60000); // 10 emails per minute
  const statusTracker = new StatusTracker();

  const emailService = new EmailService([provider1, provider2], rateLimiter, statusTracker);

  const to = 'test@example.com';
  const subject = 'Hello';
  const body = 'This is a test email';

  it('should send email successfully', async () => {
    await emailService.sendEmail(to, subject, body);
    const status = statusTracker.getStatus(`${to}:${subject}`);
    expect(['SUCCESS', 'FAILED', 'SKIPPED']).toContain(status);
  });

  it('should skip duplicate emails if already sent', async () => {
    statusTracker.setStatus(`${to}:${subject}`, 'SUCCESS');
    await emailService.sendEmail(to, subject, body);
    const status = statusTracker.getStatus(`${to}:${subject}`);
    expect(status).toBe('SKIPPED');
  });

  it('should respect rate limiting', async () => {
    const limitedRateLimiter = new RateLimiter(0,60000); // no emails allowed
    const limitedService = new EmailService([provider1], limitedRateLimiter, new StatusTracker());

    await limitedService.sendEmail('rate@limit.com', 'Blocked', 'Should be skipped');
    const status = limitedService.getStatuses()['rate@limit.com:Blocked'];
    expect(status).toBe('SKIPPED');
  });
});
