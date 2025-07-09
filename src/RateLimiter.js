"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(capacity, refillTime) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillTime = refillTime;
        this.lastRefill = Date.now();
    }
    allow() {
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
exports.RateLimiter = RateLimiter;
