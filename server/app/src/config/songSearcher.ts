import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'
import { SongSearcher } from '../services/SongSearcher'

export function songSearcher({ container }: interfaces.Context) {
  const songSearcher = new SongSearcher(container.get<Elasticsearch.Client>('elasticsearch'))

  return songSearcher
}