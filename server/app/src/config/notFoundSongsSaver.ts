import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'
import { NotFoundSongsSaver } from '../services/NotFoundSongsSaver'

export function notFoundSongsSaver({ container }: interfaces.Context) {
  const notFoundSongsSaver = new NotFoundSongsSaver(container.get<Elasticsearch.Client>('elasticsearch'))

  return notFoundSongsSaver
}