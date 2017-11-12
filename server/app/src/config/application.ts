import { interfaces } from 'inversify'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'

export function application(context: interfaces.Context) {
  const router = context.container.get<express.IRouter<any>>('router')
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(router)

  app.locals.json = JSON.stringify

  return app
}