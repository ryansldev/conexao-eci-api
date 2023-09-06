import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const authBody = z.object({
      login: z.string(),
      password: z.string(),
    })

    const {
      login,
      password,
    } = authBody.parse(request.body)

    const student = await prisma.student.findFirst({
      where: {
        login,
      }
    })

    if(!student) {
      return reply.status(404).send({ message: 'User not found' })
    }

    if(!(await bcrypt.compare(password, student.password))) {
      return reply.status(400).send({ message: 'Login or password is invalid' })
    }

    const jwtSecret = process.env.JWT_SECRET!;

    const token = jwt.sign({
      id: student.id,
    }, jwtSecret, {
      expiresIn: 86400,
    })

    return reply.status(200).send({
      token,
    })
  }
}