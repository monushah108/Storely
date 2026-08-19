const buckets = new Map();

const CAPACITY = 10;
const REFILL_INTERVAL = 10000;

export function consumeToken(request, response, next) {
  const now = Date.now();

  const key =
    request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    request.ip ||
    "anonymous";

  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: now,
    };

    buckets.set(key, bucket);
  }

  // Calculate elapsed time
  const elapsed = now - bucket.lastRefill;

  // Calculate tokens to refill
  const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL);

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + tokensToAdd);

    bucket.lastRefill += tokensToAdd * REFILL_INTERVAL;
  }

  // No tokens left
  if (bucket.tokens <= 0) {
    return response.status(429).json({
      success: false,
      remaining: 0,
      message: "Too many requests. Try again later.",
    });
  }

  // Consume token
  bucket.tokens--;

  return next();
}
