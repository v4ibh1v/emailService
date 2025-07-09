export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillTime: number;

  constructor(capacity: number, refillTime: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillTime = refillTime;
    this.lastRefill = Date.now();
  }

  allow(): boolean {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    if (elapsed > this.refillTime) {
      this.tokens = this.capacity;
      this.lastRefill = now;
    }

    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }

    return false;
  }
}