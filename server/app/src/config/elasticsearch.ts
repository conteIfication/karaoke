import { interfaces } from 'inversify'
import * as Elasticsearch from 'elasticsearch'

export function elasticsearch({ container }: interfaces.Context) {
    const config = container.get<EnvironmentVariables>('config')

    const elasticsearch = new Elasticsearch.Client({
        host: `${config.DB_HOST}:${config.DB_PORT}`,
        log: [{
            type: 'stdio',
            levels: ['error']
          }]

    })

    return elasticsearch
  }
