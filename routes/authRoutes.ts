// routes/usersRoutes.ts

import { Router } from "express";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", authController.registrationController);
router.post("/login", authController.loginController);
router.post(
  "/logout",
  authMiddleware(["user", "admin"]),
  authController.logoutController
);

export default router;
