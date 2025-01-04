import { Router } from "express";
import { UserController } from "../controller";
import { CreateUserInput, GetUserInput, LoginInput } from "../inputs/user";
import { UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login, getUser, getAllUsers } = userController;
const { validateUserSignup, validateUserLogin, validateGetUser } = UserRequestValidator;

const router: Router = Router();

router.post("/signup", validateUserSignup(CreateUserInput), createUser.bind(userController));
router.get("", getAllUsers.bind(userController));
router.get("/:id", validateGetUser(GetUserInput), getUser.bind(userController));
router.post("/login", validateUserLogin(LoginInput), login.bind(userController));

export default router;
