export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      console.log(`⚠️ Attempt ${attempt} failed. Retrying in ${delay * Math.pow(2, attempt)}ms...`);

      if (attempt === retries) {
        throw new Error("❌ All retries failed");
      }

      await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
    }
  }

  throw new Error("❌ Retry logic error");
}
