import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'

@injectable()
export class FoundSongsSaver {

  private elasticsearch: Elasticsearch.Client

  constructor(elasticsearch: Elasticsearch.Client) {
    this.elasticsearch = elasticsearch
  }

  public saveFoundSong(lyrics: string, artist: string, title: string) {
    this.elasticsearch.index({
      index: 'karaoke',
      type: 'found-songs',
      body: {
        searchedLyrics: lyrics,
        artist: artist,
        title: title,
        date: Date.now()
      }
    })

  }
}