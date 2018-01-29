import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'

@injectable()
export class WrongSongsSaver {

  private elasticsearch: Elasticsearch.Client

  constructor(elasticsearch: Elasticsearch.Client) {
    this.elasticsearch = elasticsearch
  }

  public saveWrongSong(lyrics: string, songArtist: string, songTitle: string) {
    this.elasticsearch.index({
      index: 'karaoke',
      type: 'wrong-songs',
      body: {
        searchedLyrics: lyrics,
        artist: songArtist,
        title: songTitle,
        date: Date.now()
      }
    })

  }
}