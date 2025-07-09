"use strict";
// src/EmailService.ts
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
exports.EmailService = void 0;
const Retry_1 = require("./Retry");
class EmailService {
    constructor(providers, rateLimiter, statusTracker) {
        this.providers = providers;
        this.rateLimiter = rateLimiter;
        this.statusTracker = statusTracker;
    }
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailId = `${to}:${subject}`;
            // Avoid duplicate sends
            const existingStatus = this.statusTracker.getStatus(emailId);
            if (existingStatus === 'SUCCESS') {
                console.log(`⚠️ Email already sent successfully to ${to}. Skipping.`);
                this.statusTracker.setStatus(emailId, 'SKIPPED');
                return;
            }
            // Rate limiting
            if (!this.rateLimiter.allow()) {
                this.statusTracker.setStatus(emailId, 'SKIPPED');
                console.log(`⛔ Rate limit hit. Skipping email to ${to}`);
                return;
            }
            for (const provider of this.providers) {
                try {
                    this.statusTracker.setStatus(emailId, 'RETRYING');
                    const result = yield (0, Retry_1.retryWithExponentialBackoff)(() => provider.sendEmail(to, subject, body));
                    if (result) {
                        this.statusTracker.setStatus(emailId, 'SUCCESS');
                        console.log(`✅ Email sent successfully to ${to}`);
                        return;
                    }
                    else {
                        throw new Error("Provider returned false");
                    }
                }
                catch (error) {
                    console.log(`❌ Failed with one provider, trying next...`);
                }
            }
            this.statusTracker.setStatus(emailId, 'FAILED');
            console.log(`❌ All providers failed to send email to ${to}`);
        });
    }
    getStatuses() {
        return this.statusTracker.getAllStatuses();
    }
}
exports.EmailService = EmailService;
