import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'
import { ReportsGenerator } from '../services/ReportsGenerator'

export function reportsGenerator({ container }: interfaces.Context) {
  const reportsGenerator = new ReportsGenerator(container.get<Elasticsearch.Client>('elasticsearch'))

  return reportsGenerator
}