"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTracker = void 0;
class StatusTracker {
    constructor() {
        this.statuses = new Map();
    }
    setStatus(emailId, status) {
        this.statuses.set(emailId, status);
    }
    getStatus(emailId) {
        return this.statuses.get(emailId);
    }
    getAllStatuses() {
        return Object.fromEntries(this.statuses.entries());
    }
}
exports.StatusTracker = StatusTracker;
