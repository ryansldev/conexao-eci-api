import { FastifyInstance } from "fastify";

import { StudentController } from "./controllers/Student";
import { AuthController } from "./controllers/Auth";
import { ChallengeController } from "./controllers/Challenge";
import { ChallengedController } from "./controllers/Challenged";
import { TeacherController } from "./controllers/Teacher";

const authController = new AuthController();

const studentController = new StudentController();
const teacherController = new TeacherController();

const challengeController = new ChallengeController();
const challengedController = new ChallengedController();

export async function appRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.get("/students", studentController.list);
  app.get("/students/:id", studentController.find);

  app.post("/challenges", challengeController.create);

  app.post("/challenges/:id", challengedController.create);
}

export async function appUnauthenticatedRoutes(app: FastifyInstance) {
  app.post("/auth", authController.create);
  app.get("/teachers", teacherController.list);
  app.post("/teachers", teacherController.create);

  app.post("/students", studentController.create);

  app.get("/challenges", challengeController.list);
  app.get("/challenges/:id", challengedController.list);
  app.get("/challenges/:id/duel", challengedController.getDuel);
  app.patch("/challenges/:id/duel", challengedController.duel);
}
