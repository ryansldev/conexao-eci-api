import { FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export class TeacherController {
  async list() {
    return await prisma.teacher.findMany()
  }

  async create(request: FastifyRequest) {
    const createTeacherBody = z.object({
      name: z.string(),
      profile_pic: z.string(),
    })

    const { name, profile_pic } = createTeacherBody.parse(request.body)

    await prisma.teacher.create({
      data: {
        name,
        profile_pic,
      }
    })
  }
}