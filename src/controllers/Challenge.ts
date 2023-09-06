import { FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma"

export class ChallengeController {
  async create(request: FastifyRequest) {
    const createChallengeBody = z.object({
      title: z.string(),
    })

    const { title } = createChallengeBody.parse(request.body)

    return await prisma.challenge.create({
      data: {
        title
      }
    })
  }

  async list() {
    return await prisma.challenge.findMany()
  }
}