import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken'

export function authMiddleware(request: FastifyRequest, reply: FastifyReply, done: any) {
  if(!process.env.JWT_SECRET) return reply.status(404).send({ message: 'JWT Secret not found' })
  
  const authMiddlewareHeader = z.object({
    authorization: z.string()
  })

  try {
    const { authorization } = authMiddlewareHeader.parse(request.headers)
    // A token is sent with 'bearer' before hash
    // so we have to split them.

    const parts = authorization.split(' ')

    if(parts.length !== 2) {
      return reply.status(422).send({ message: 'Token error' })
    }

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)) {
      return reply.status(422).send({ message: 'Token poorly formatted' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded: any) => {
      if(error) {
        return reply.status(401).send({ message: 'Invalid token' })
      }

      if(!decoded) {
        return reply.status(404).send({ message: 'ID not found' })
      }

      reply.headers({
        userId: decoded.id,
      })
      
      done()
    })
  } catch (e) {
    return reply.status(404).send({ message: 'Token not found' })
  }
}