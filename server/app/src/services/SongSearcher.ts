import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'

@injectable()
export class SongSearcher {

  private elasticsearch: Elasticsearch.Client

  constructor(elasticsearch: Elasticsearch.Client) {
    this.elasticsearch = elasticsearch
  }

  public async findByLyrics(lyrics: string): Promise<string> {
    return this.elasticsearch.search({
      index: 'karaoke',
      type: 'songs',
      body: {
        query: {
          wildcard: {
            fullText: {
              value: `*${lyrics}*`
            }
          }
        },
      }
    }).then(resp => {
      if (resp.hits.hits.length > 0) {
        console.log('ooo')
        return JSON.stringify(resp.hits.hits[0]['_source'])
      } else {
        return null
      }
    }, err => {
      return null
    })

  }
}