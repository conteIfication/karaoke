// require('ts-node').register({ignore: false})

import * as express from 'express'
import * as http from 'http'
import container from '../src/app'

const app = container.get<express.Application>('app')

const server = http.createServer(app)

app.set('port', 80)

server.listen(80)