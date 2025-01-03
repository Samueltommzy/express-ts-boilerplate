import { Router } from "express";
import { UserController } from "../controller";
import { UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login } = userController;
const { validateUserSignup, validateUserLogin } = UserRequestValidator;

const router: Router = Router();

router.post("/signup", validateUserSignup, createUser.bind(userController));
router.post("/login", validateUserLogin, login.bind(userController));

export default router;
