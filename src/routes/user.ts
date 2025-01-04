import { Router } from "express";
import { UserController } from "../controller";
import { CreateUserInput, GetUserInput, LoginInput } from "../inputs/user";
import { TokenValidator, UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login, getUser, getAllUsers } = userController;
const { validateUserSignup, validateUserLogin, validateGetUser } = UserRequestValidator;
const { validateToken } = TokenValidator;

const router: Router = Router();

router.post("/signup", validateUserSignup(CreateUserInput), createUser.bind(userController));
router.get("", validateToken, getAllUsers.bind(userController));
router.get("/:id", validateToken, validateGetUser(GetUserInput), getUser.bind(userController));
router.post("/login", validateUserLogin(LoginInput), login.bind(userController));

export default router;
