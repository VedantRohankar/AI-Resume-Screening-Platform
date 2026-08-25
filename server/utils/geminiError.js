
// Helper to pause execution for Exponential Backoff
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callGeminiWithRetry = async (apiCallFn, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Execute the passed-in API function
      return await apiCallFn();
    } catch (error) {
      const isServiceUnavailable = 
        error.message.includes("503") || 
        error.message.includes("UNAVAILABLE") ||
        error.status === 503;

      if (isServiceUnavailable) {
        if (attempt === maxRetries) {
          console.error("Max retries reached. Gemini is still unavailable.");
          throw error;
        }
        const waitTime = baseDelay * Math.pow(2, attempt);
        console.warn(`Gemini 503 Error. Retrying attempt ${attempt + 1} in ${waitTime}ms...`);
        await delay(waitTime);
      } else {
        // If it's a different error (e.g., 400 Bad Request, 403 Forbidden), throw immediately
        throw error;
      }
    }
  }
};