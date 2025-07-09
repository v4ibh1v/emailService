export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export class MockEmailProvider1 implements IEmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`📨 MockProvider1: Sending email to ${to}`);
    return Math.random() > 0.3; // 70% chance of success
  }
}

export class MockEmailProvider2 implements IEmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`📨 MockProvider2: Sending email to ${to}`);
    return Math.random() > 0.5; // 50% chance of success
  }
}
