import Fastify from 'fastify'
import { appRoutes, appUnauthenticatedRoutes } from './routes'

const app = Fastify()
app.register(appRoutes)
app.register(appUnauthenticatedRoutes)

app.listen({
  port: Number(process.env.PORT),
  host: process.env.HOST,
}).then(() => console.log('HTTP Server running!'))