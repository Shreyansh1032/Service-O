import redisClient from "../config/redis.js";

const LOCK_TTL_SECONDS = 600; // matches booking-service's 10-min expiresAt
const LOCK_PREFIX = "lock:seat:";

// Lua: check ALL keys are free before setting ANY — avoids partial locks
const ACQUIRE_LOCKS_SCRIPT = `
for i, key in ipairs(KEYS) do
  if redis.call("EXISTS", key) == 1 then
    return 0
  end
end
for i, key in ipairs(KEYS) do
  redis.call("SET", key, ARGV[1], "EX", ARGV[2])
end
return 1
`;

export const acquireSeatLocks = async (seatIds, bookingId) => {
  const keys = seatIds.map((id) => `${LOCK_PREFIX}${id}`);
  const result = await redisClient.eval(
    ACQUIRE_LOCKS_SCRIPT,
    keys.length,
    ...keys,
    bookingId,
    LOCK_TTL_SECONDS
  );
  return result === 1;
};

export const releaseSeatLocks = async (seatIds) => {
  const keys = seatIds.map((id) => `${LOCK_PREFIX}${id}`);
  if (keys.length === 0) return;
  await redisClient.del(...keys);
};

// returns array of seatIds whose Redis lock has expired (or never existed)
export const getExpiredLockedSeatIds = async (seatIds) => {
  const keys = seatIds.map((id) => `${LOCK_PREFIX}${id}`);
  if (keys.length === 0) return [];
  const results = await redisClient.mget(...keys); // null = key missing/expired
  return seatIds.filter((_, i) => results[i] === null);
};