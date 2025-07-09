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
exports.retryWithExponentialBackoff = retryWithExponentialBackoff;
function retryWithExponentialBackoff(fn_1) {
    return __awaiter(this, arguments, void 0, function* (fn, retries = 3, delay = 500) {
        let attempt = 0;
        while (attempt < retries) {
            try {
                return yield fn();
            }
            catch (error) {
                attempt++;
                console.log(`⚠️ Attempt ${attempt} failed. Retrying in ${delay * Math.pow(2, attempt)}ms...`);
                if (attempt === retries) {
                    throw new Error("❌ All retries failed");
                }
                yield new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
            }
        }
        throw new Error("❌ Retry logic error");
    });
}
