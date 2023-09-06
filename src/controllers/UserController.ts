import { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'

export class UserController {
  async list() {
    const students = await prisma.student.findMany()
    return students.map(({
      id,
      name,
      login,
      email,
      room,
      profile_pic,
    }) => {
      return {
        id,
        name,
        login,
        email,
        room,
        profile_pic,
      }
    })
  }
  
  async create(request: FastifyRequest) {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
      login: z.string(),
      password: z.string(),
      profile_pic: z.string().optional(),
      room: z.string(),
    });
  
    const {
      name,
      login,
      email,
      room,
      password,
      profile_pic
    } = createUserBody.parse(request.body)

    const encryptedPassword = await bcrypt.hash(password, 10)
  
    await prisma.student.create({
      data: {
        name,
        login,
        email,
        room,
        password: encryptedPassword,
        profile_pic
      },
    });
  }

  async find(request: FastifyRequest) {
    const findUserParams = z.object({
      id: z.string()
    })

    const { id } = findUserParams.parse(request.params)

    const student = await prisma.student.findMany({
      where: {
        id
      }
    })

    return student.map(({
      id,
      name,
      login,
      email,
      profile_pic,
      room,
    }) => {
      return {
        id,
        name,
        login,
        email,
        profile_pic,
        room,
      }
    })
  }
}