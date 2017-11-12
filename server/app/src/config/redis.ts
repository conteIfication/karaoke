import { interfaces } from 'inversify'
import * as Redis from 'redis'

export function redis({ container }: interfaces.Context): Redis.RedisClient {
  const config = container.get<EnvironmentVariables>('config')

  return Redis.createClient({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT
  })
}