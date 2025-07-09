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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const RateLimiter_1 = require("./RateLimiter");
const StatusTracker_1 = require("./StatusTracker");
const MockEmailProvider_1 = require("./MockEmailProvider");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Initialize services
const rateLimiter = new RateLimiter_1.RateLimiter(5, 60000); // 5 emails/minute
const statusTracker = new StatusTracker_1.StatusTracker();
const emailService = new EmailService_1.EmailService([new MockEmailProvider_1.MockEmailProvider1(), new MockEmailProvider_1.MockEmailProvider2()], rateLimiter, statusTracker);
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        yield emailService.sendEmail(to, subject, body);
        res.json({ status: emailService.getStatuses() });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
}));
app.get('/status', (req, res) => {
    res.json(emailService.getStatuses());
});
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
