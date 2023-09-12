import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from "@fastify/jwt"

import { appRoutes, appUnauthenticatedRoutes } from './routes'

const app = Fastify()

if(!process.env.JWT_SECRET) {
  throw new Error("JWT Secret not found")
}

app.register(jwt, {
  secret: process.env.JWT_SECRET,
})
app.register(cors)
app.register(appRoutes)
app.register(appUnauthenticatedRoutes)

app.listen({
  port: Number(process.env.PORT),
  host: process.env.HOST,
}).then(() => console.log('HTTP Server running!'))