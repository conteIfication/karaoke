import * as express from 'express'
import * as http from 'http'
import * as passportModule from 'passport'
import container from '../src/app'
import * as bodyParser from 'body-parser'

const app = container.get<express.Application>('app')

app.set('port', 80)

const server = http.createServer(app)

server.listen(80)