import Fastify from 'fastify'
import { appRoutes } from './routes'

const app = Fastify()
app.register(appRoutes)

app.listen({
  port: Number(process.env.PORT),
  host: process.env.HOST,
}).then(() => console.log('HTTP Server running!'))