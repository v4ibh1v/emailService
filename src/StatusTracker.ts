type Status = 'SUCCESS' | 'FAILED' | 'RETRYING' | 'SKIPPED';

export class StatusTracker {
  private statuses: Map<string, Status> = new Map();

  setStatus(emailId: string, status: Status): void {
    this.statuses.set(emailId, status);
  }

  getStatus(emailId: string): Status | undefined {
    return this.statuses.get(emailId);
  }

  getAllStatuses(): Record<string, Status> {
    return Object.fromEntries(this.statuses.entries());
  }
}
