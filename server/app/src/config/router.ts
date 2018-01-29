import { interfaces } from 'inversify'
import * as express from 'express'

export const ROUTE_REGISTRY_ID = Symbol('route')

export function router(context: interfaces.Context) {
  const router = express.Router()
  const config = context.container.get<EnvironmentVariables>('config')
  const routes = context.container.getAll<express.IRouter<any>>(ROUTE_REGISTRY_ID)

  for (const route in routes) {
    router.use(routes[route])
  }

  router.use((req, res, next) => {
    res.sendStatus(400)
  })

  return router
}