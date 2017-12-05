import * as Redis from 'redis'
import { injectable } from 'inversify'

@injectable()
export class PopularLyricsStorage {
  private redis: Redis.RedisClient

  constructor(redis: Redis.RedisClient) {
    this.redis = redis
  }

  getSongData(lyrics: string): Promise<string> {
    return new Promise(resolve => {
      this.redis.get(lyrics, (err, reply) => resolve(reply))
    })
  }

  async saveSongData(lyrics: string, songData: string): Promise<any> {
    return new Promise(resolve => {
      this.redis.set(lyrics, songData, 'EX', 3600 * 24 * 30, (err: any, reply: any) => resolve(reply))
    })
  }
}
