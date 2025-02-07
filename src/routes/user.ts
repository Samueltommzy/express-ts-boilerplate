import { Router } from "express";
import { UserController } from "../controller";
import { CreateUserInput, GetUserInput, LoginInput, UpdateUserInput } from "../inputs/user";
import { TokenService, UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login, getUser, getAllUsers, updateUser, deleteUser } = userController;
const { validateUserSignup, validateUserLogin, validateGetUser, validateUserUpdate } =
	UserRequestValidator;
const { validateToken } = TokenService;

const userRoutes: Router = Router();

userRoutes.post("/signup", validateUserSignup(CreateUserInput), createUser.bind(userController));
userRoutes.get("", validateToken, getAllUsers.bind(userController));
userRoutes.get("/:id", validateToken, validateGetUser(GetUserInput), getUser.bind(userController));
userRoutes.put(
	"/:id",
	validateToken,
	validateUserUpdate(UpdateUserInput, GetUserInput),
	updateUser.bind(userController),
);
userRoutes.delete(
	"/:id",
	validateToken,
	validateGetUser(GetUserInput),
	deleteUser.bind(userController),
);
userRoutes.post("/login", validateUserLogin(LoginInput), login.bind(userController));

export default userRoutes;
