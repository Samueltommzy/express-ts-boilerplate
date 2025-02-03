import { Router } from "express";
import { UserController } from "../controller";
import { CreateUserInput, GetUserInput, LoginInput } from "../inputs/user";
import { TokenService, UserRequestValidator } from "../middleware";

const userController = new UserController();
const { createUser, login, getUser, getAllUsers } = userController;
const { validateUserSignup, validateUserLogin, validateGetUser } = UserRequestValidator;
const { validateToken } = TokenService;

const useRoutes: Router = Router();

useRoutes.post("/signup", validateUserSignup(CreateUserInput), createUser.bind(userController));
useRoutes.get("", validateToken, getAllUsers.bind(userController));
useRoutes.get("/:id", validateToken, validateGetUser(GetUserInput), getUser.bind(userController));
useRoutes.post("/login", validateUserLogin(LoginInput), login.bind(userController));

export default useRoutes;
