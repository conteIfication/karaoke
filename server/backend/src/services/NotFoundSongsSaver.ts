import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'

@injectable()
export class NotFoundSongsSaver {

  private elasticsearch: Elasticsearch.Client

  constructor(elasticsearch: Elasticsearch.Client) {
    this.elasticsearch = elasticsearch
  }

  public saveNotFoundSong(lyrics: string) {
    this.elasticsearch.index({
      index: 'karaoke',
      type: 'not-found-songs',
      body: {
        lyrics: lyrics,
        date: Date.now()
      }
    })

  }
}