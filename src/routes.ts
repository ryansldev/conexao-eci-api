import { FastifyInstance } from 'fastify'

import { UserController } from './controllers/UserController'
import { AuthController } from './controllers/AuthController'
import { authMiddleware } from './middlewares/auth'

const userController = new UserController()
const authController = new AuthController()

export async function appRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)
  
  app.post('/students', userController.create)
  app.get('/students', userController.list)
  app.get('/students/:id', userController.find)
}

export async function appUnauthenticatedRoutes(app: FastifyInstance) {
  app.post('/auth', authController.create)
}