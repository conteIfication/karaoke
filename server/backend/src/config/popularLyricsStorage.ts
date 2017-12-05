import { interfaces } from 'inversify'
import * as Redis from 'redis'
import { PopularLyricsStorage } from '../services/PopularLyricsStorage'

export function popularLyricsStorage(context: interfaces.Context) {
  const popularLyricsStorage = new PopularLyricsStorage(context.container.get<Redis.RedisClient>('redis'))

  return popularLyricsStorage
}