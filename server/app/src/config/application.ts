import { interfaces } from 'inversify'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'
let flash = require('connect-flash')
import * as session from 'express-session'
import * as passportModule from 'passport'

export function application(context: interfaces.Context) {
  const router = context.container.get<express.IRouter<any>>('router')
  const app = express()

  app.use(session({ secret: 'b5a4r7d2z4o6T2a6j2n4e' }))
  app.set('view engine','ejs')
  app.use(passportModule.initialize())
  app.use(passportModule.session())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(flash())
  app.use(router)

  app.locals.json = JSON.stringify

  return app
}