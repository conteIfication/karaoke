import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'
import { SongResult } from '../models/Song'

@injectable()
export class SongSearcher {

  private elasticsearch: Elasticsearch.Client

  constructor(elasticsearch: Elasticsearch.Client) {
    this.elasticsearch = elasticsearch
  }

  public async findByLyrics(lyrics: string): Promise<SongResult[]> {
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
      if (resp.hits.total > 0) {
        const returnedArray = []
        let index = 0
        while (index < 10 && index < resp.hits.total && resp.hits.hits[index]._score === resp.hits.max_score) {
          returnedArray.push(resp.hits.hits[index]['_source'])
          index++
        }
        return returnedArray
      } else {
        return []
      }
    }, err => {
      return []
    })

  }
}