import * as express from 'express'
import * as http from 'http'
import container from '../src/app'
import * as bodyParser from 'body-parser'

const app = container.get<express.Application>('app')

const server = http.createServer(app)

app.use(bodyParser.urlencoded({ extended: false }))
app.set('port', 80)

server.listen(80)