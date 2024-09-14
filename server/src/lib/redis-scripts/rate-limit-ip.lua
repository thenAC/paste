local key = KEYS[1]
local limit = tonumber(ARGV[1])
local windowTime = tonumber(ARGV[2])
local currentTime = tonumber(ARGV[3])

redis.call('ZREMRANGEBYSCORE', key, 0, currentTime - windowTime)

local count = redis.call('ZCARD', key)

if count >= limit then
  return 0
else
  redis.call('ZADD', key, currentTime, currentTime)
  redis.call('EXPIRE', key, windowTime)
  return 1
end
