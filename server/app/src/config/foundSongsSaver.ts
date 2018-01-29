import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'
import { FoundSongsSaver } from '../services/FoundSongsSaver'

export function foundSongsSaver({ container }: interfaces.Context) {
  const notFoundSongsSaver = new FoundSongsSaver(container.get<Elasticsearch.Client>('elasticsearch'))

  return notFoundSongsSaver
}