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
exports.MockEmailProvider2 = exports.MockEmailProvider1 = void 0;
class MockEmailProvider1 {
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`📨 MockProvider1: Sending email to ${to}`);
            return Math.random() > 0.3; // 70% chance of success
        });
    }
}
exports.MockEmailProvider1 = MockEmailProvider1;
class MockEmailProvider2 {
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`📨 MockProvider2: Sending email to ${to}`);
            return Math.random() > 0.5; // 50% chance of success
        });
    }
}
exports.MockEmailProvider2 = MockEmailProvider2;
