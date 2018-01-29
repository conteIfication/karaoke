import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'
import { WrongSongsSaver } from '../services/WrongSongsSaver'

export function wrongSongsSaver({ container }: interfaces.Context) {
  const wrongSongsSaver = new WrongSongsSaver(container.get<Elasticsearch.Client>('elasticsearch'))

  return wrongSongsSaver
}