import 'reflect-metadata'
import { Container } from 'inversify'
import * as express from 'express'
import * as Redis from 'redis'
import * as Elasticsearch from 'elasticsearch'
import { PopularLyricsStorage } from './services/PopularLyricsStorage'
import { SongSearcher } from './services/SongSearcher'
import FileParser from './services/FileParser'
import { application } from './config/application'
import { router, ROUTE_REGISTRY_ID } from './config/router'
import { redis } from './config/redis'
import { elasticsearch } from './config/elasticsearch'
import { popularLyricsStorage } from './config/popularLyricsStorage'
import { songSearcher } from './config/songSearcher'
import { apiRouter } from './routes/api'

const container = new Container()

container.bind<EnvironmentVariables>('config').toConstantValue(process.env)
container.bind<Redis.RedisClient>('redis').toDynamicValue(redis).inSingletonScope()
container.bind<Elasticsearch.Client>('elasticsearch').toDynamicValue(elasticsearch).inSingletonScope()
container.bind<PopularLyricsStorage>('popularLyricsStorage').toDynamicValue(popularLyricsStorage).inSingletonScope()
container.bind<SongSearcher>('songSearcher').toDynamicValue(songSearcher).inSingletonScope()
container.bind<FileParser>('fileParser').to(FileParser).inSingletonScope()
container.bind<express.IRouter<any>>('router').toDynamicValue(router).inSingletonScope()
container.bind<express.Application>('app').toDynamicValue(application).inSingletonScope()
container.bind<express.IRouter<any>>(ROUTE_REGISTRY_ID).toDynamicValue(apiRouter).inSingletonScope()

export default container