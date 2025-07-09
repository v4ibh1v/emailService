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
const EmailService_1 = require("./EmailService");
const StatusTracker_1 = require("./StatusTracker");
const RateLimiter_1 = require("./RateLimiter");
const MockEmailProvider_1 = require("./MockEmailProvider");
// Create instance of EmailService with 2 providers, 5 emails per 60 seconds
const emailService = new EmailService_1.EmailService([new MockEmailProvider_1.MockEmailProvider1(), new MockEmailProvider_1.MockEmailProvider2()], new RateLimiter_1.RateLimiter(5, 60000), new StatusTracker_1.StatusTracker());
// Sample email sending
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield emailService.sendEmail('test@example.com', 'Test Subject', 'Hello from the email service!');
        console.log('✅ Email sent!');
    }
    catch (err) {
        console.error('❌ Email failed:', err.message);
    }
}))();
