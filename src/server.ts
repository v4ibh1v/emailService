import express from 'express';
import { EmailService } from './EmailService';
import { RateLimiter } from './RateLimiter';
import { StatusTracker } from './StatusTracker';
import { MockEmailProvider1, MockEmailProvider2 } from './MockEmailProvider';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize services
const rateLimiter = new RateLimiter(5, 60000); // 5 emails/minute
const statusTracker = new StatusTracker();
const emailService = new EmailService(
  [new MockEmailProvider1(), new MockEmailProvider2()],
  rateLimiter,
  statusTracker
);

app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await emailService.sendEmail(to, subject, body);
    res.json({ status: emailService.getStatuses() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: (error as Error).message });
  }
});

app.get('/status', (req, res) => {
  res.json(emailService.getStatuses());
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
