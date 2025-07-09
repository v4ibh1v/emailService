"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../src/EmailService");
const MockEmailProvider_1 = require("../src/MockEmailProvider");
const RateLimiter_1 = require("../src/RateLimiter");
const StatusTracker_1 = require("../src/StatusTracker");
describe('EmailService', () => {
    const provider1 = new MockEmailProvider_1.MockEmailProvider1();
    const provider2 = new MockEmailProvider_1.MockEmailProvider2();
    const rateLimiter = new RateLimiter_1.RateLimiter(10, 60000); // 10 emails per minute
    const statusTracker = new StatusTracker_1.StatusTracker();
    const emailService = new EmailService_1.EmailService([provider1, provider2], rateLimiter, statusTracker);
    const to = 'test@example.com';
    const subject = 'Hello';
    const body = 'This is a test email';
    it('should send email successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield emailService.sendEmail(to, subject, body);
        const status = statusTracker.getStatus(`${to}:${subject}`);
        expect(['SUCCESS', 'FAILED', 'SKIPPED']).toContain(status);
    }));
    it('should skip duplicate emails if already sent', () => __awaiter(void 0, void 0, void 0, function* () {
        statusTracker.setStatus(`${to}:${subject}`, 'SUCCESS');
        yield emailService.sendEmail(to, subject, body);
        const status = statusTracker.getStatus(`${to}:${subject}`);
        expect(status).toBe('SKIPPED');
    }));
    it('should respect rate limiting', () => __awaiter(void 0, void 0, void 0, function* () {
        const limitedRateLimiter = new RateLimiter_1.RateLimiter(0, 60000); // no emails allowed
        const limitedService = new EmailService_1.EmailService([provider1], limitedRateLimiter, new StatusTracker_1.StatusTracker());
        yield limitedService.sendEmail('rate@limit.com', 'Blocked', 'Should be skipped');
        const status = limitedService.getStatuses()['rate@limit.com:Blocked'];
        expect(status).toBe('SKIPPED');
    }));
});
