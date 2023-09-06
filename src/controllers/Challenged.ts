import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export class ChallengedController {
  async create(request: FastifyRequest) {
    const createChallengeParams = z.object({
      id: z.string()
    })

    const { id: challengeId } = createChallengeParams.parse(request.params)

    const createChallengedBody = z.object({
      name: z.string(),
      profile_pic: z.string(),
    })

    const {
      name,
      profile_pic
    } = createChallengedBody.parse(request.body)

    return await prisma.challenged.create({
      data: {
        name,
        profile_pic,
        challengeId,
      }
    })
  }

  async list(request: FastifyRequest) {
    const createChallengeParams = z.object({
      id: z.string()
    })

    const { id: challengeId } = createChallengeParams.parse(request.params)

    return await prisma.challenged.findMany({
      where: {
        challengeId
      }
    })
  }

  async getDuel(request: FastifyRequest) {
    const createChallengeParams = z.object({
      id: z.string()
    })

    const { id: challengeId } = createChallengeParams.parse(request.params)

    const challengedCount = await prisma.challenged.count() - 1
    const skip = Math.floor(Math.random() * challengedCount)
    return await prisma.challenged.findMany({
      where: {
        challengeId
      },
      orderBy: {
        rating: 'desc',
      },
      take: 2,
      skip, 
    })
  }

  async duel(request: FastifyRequest, reply: FastifyReply) {
    const createChallengeParams = z.object({
      id: z.string()
    })

    const { id: challengeId } = createChallengeParams.parse(request.params)

    const challenge = await prisma.challenge.findFirst({
      where: {
        id: challengeId
      }
    })

    if(!challenge) {
      return reply.status(404).send({ message: 'Challenge not found' })
    }

    const duelBody = z.object({
      aid: z.string().uuid(),
      bid: z.string().uuid(),
      d: z.boolean(),
    })

    const {
      aid,
      bid,
      d
    } = duelBody.parse(request.body)

    const a = await prisma.challenged.findFirst({
      where: {
        challengeId,
        id: aid,
      }
    })

    if(!a) {
      return reply.status(404).send({ message: 'Challenged A not found' })
    }

    const b = await prisma.challenged.findFirst({
      where: {
        id: bid,
      }
    })

    if(!b) {
      return reply.status(404).send({ message: 'Challenged B not found' })
    }

    const ea = 1/(1 + 10 ** ((b.rating-a.rating) / 400))
    const eb = 1/(1 + 10 ** ((a.rating-b.rating) / 400))

    let ra: number;
    let rb: number;

    // case 1 -> when player A wins
    if(d) {
      ra = a.rating + 32 * (1-ea)
      rb = b.rating + 32 * (0-eb)
    } else {
      ra = a.rating + 32 * (0-ea)
      rb = b.rating + 32 * (1-eb)
    }

    await prisma.challenged.update({
      where: {
        id: aid,
      },
      data: {
        rating: ra,
      }
    })

    await prisma.challenged.update({
      where: {
        id: bid,
      },
      data: {
        rating: rb,
      }
    })

    await prisma.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        votes: challenge.votes + 1,
      }
    })

    return reply.status(200).send()
  }
}