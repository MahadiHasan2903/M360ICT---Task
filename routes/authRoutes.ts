// routes/usersRoutes.ts

import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticateTokenAndRole } from "../middlewares/authentication";

const router = Router();

router.post("/register", authController.registrationController);
router.post("/login", authController.loginController);
router.post(
  "/logout",
  authenticateTokenAndRole(["user", "admin"]),
  authController.logoutController
);

export default router;
