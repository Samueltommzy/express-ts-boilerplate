import { Router } from "express";
import { UserController } from "../controller";
import { UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login, getUser, getAllUsers } = userController;
const { validateUserSignup, validateUserLogin } = UserRequestValidator;

const router: Router = Router();

router.post("/signup", validateUserSignup, createUser.bind(userController));
router.get("", getAllUsers.bind(userController));
router.get("/:id", getUser.bind(userController));
router.post("/login", validateUserLogin, login.bind(userController));

export default router;
