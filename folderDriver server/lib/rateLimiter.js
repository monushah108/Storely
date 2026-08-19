const buckets = new Map();

const CAPACITY = 2; // maximum tokens
const REFILL_INTERVAL = 10000; // every 10 seconds

export function consumeToken(request, response, next) {
  const now = Date.now();
  const key =
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "anonymous"; // or some other unique identifier

  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: now,
    };

    buckets.set(key, bucket);
  }

  // Calculate how many tokens should be added
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL);

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + tokensToAdd);

    bucket.lastRefill += tokensToAdd * REFILL_INTERVAL;
  }

  // Reject request if no tokens remain
  if (bucket.tokens <= 0) {
    return response.status(429).json({
      success: false,
      remaining: 0,
      message: "Too many requests. Try again later.",
    });
  }

  // Consume one token
  bucket.tokens--;

  return next();
}
