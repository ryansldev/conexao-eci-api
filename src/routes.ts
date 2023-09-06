import { FastifyInstance } from 'fastify'

import { authMiddleware } from './middlewares/auth';

import { UserController } from './controllers/User'
import { AuthController } from './controllers/Auth'
import { ChallengeController } from './controllers/Challenge'
import { ChallengedController } from './controllers/Challenged'

const userController = new UserController()
const authController = new AuthController()

const challengeController = new ChallengeController()
const challengedController = new ChallengedController()

export async function appRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)
  
  app.post('/students', userController.create)
  app.get('/students', userController.list)
  app.get('/students/:id', userController.find)

  app.post('/challenges', challengeController.create)
  app.get('/challenges', challengeController.list)

  app.post('/challenges/:id', challengedController.create)
  app.get('/challenges/:id', challengedController.list)
  app.get('/challenges/:id/duel', challengedController.getDuel)
  app.patch('/challenges/:id/duel', challengedController.duel)
}

export async function appUnauthenticatedRoutes(app: FastifyInstance) {
  app.post('/auth', authController.create)
}