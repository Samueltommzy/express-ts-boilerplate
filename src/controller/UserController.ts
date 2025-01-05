import type { NextFunction, Request, Response } from "express";
import {
	HttpException,
	InvalidCredentialException,
	ResourceNotFoundException,
	UnAuthorizedException,
} from "../exceptions";
import type { IUser } from "../model";
import { UserService } from "../service";
interface IUserController {
	// userService: UserService;
	createUser: (req: Request, res: Response, next: NextFunction) => void;
	getUser: (req: Request, res: Response, next: NextFunction) => void;
	getAllUsers: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
}
class UserController implements IUserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}
	public async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			await this.userService.createUser(req.body);
			// send notification email - publish to message broker

			res.status(200).json({ message: "User signed up successfully" });
		} catch (err) {
			next(err);
		}
	}

	public async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			const user = (await this.userService.getUser(req.params.id)) as IUser;
			if (user == null) {
				throw new ResourceNotFoundException("User not found");
			}
			if (req.body._id != user._id) {
				throw new UnAuthorizedException("You are not authorized to view this user");
			}
			res.status(200).json(user);
		} catch (err) {
			next(err);
		}
	}

	public async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = (await this.userService.getAllUsers()) as IUser[];
			res.status(200).json(users);
		} catch (err) {
			next(err);
		}
	}

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const token = await this.userService.login(req.body);
			res.status(200).json({ message: "User logged in successfully", token });
		} catch (err) {
			next(err);
		}
	}
}

export default UserController;
