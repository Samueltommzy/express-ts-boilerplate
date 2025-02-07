import type { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions";
import type { IUser } from "../model";
import { UserService } from "../service";
import { ResponseHandler } from "../utils";
interface IUserController {
	// userService: UserService;
	createUser: (req: Request, res: Response, next: NextFunction) => void;
	getUser: (req: Request, res: Response, next: NextFunction) => void;
	getAllUsers: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
	updateUser: (req: Request, res: Response, next: NextFunction) => void;
	deleteUser: (req: Request, res: Response, next: NextFunction) => void;
}
class UserController implements IUserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}
	public async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const stripeId = await this.userService.createUser(req.body);
			// send notification email - publish to message broker
			ResponseHandler.sendResponse(res, 201, "User signed up successfully", { stripeId });
		} catch (err) {
			next(err);
		}
	}

	public async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			const user = (await this.userService.getUser(req.params.id, req.body._id)) as IUser;
			ResponseHandler.sendResponse(res, 200, "User fetched", user);
		} catch (err) {
			next(err);
		}
	}

	public async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = (await this.userService.getAllUsers()) as IUser[];
			ResponseHandler.sendResponse(res, 200, undefined, users);
		} catch (err) {
			next(err);
		}
	}

	public async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.id;
			const userData = req.body;
			const decodedUserId = userData._id;
			// if user

			const user = await this.userService.updateUser(userId, decodedUserId, userData);
			ResponseHandler.sendResponse(res, 200, undefined, user);
		} catch (err) {
			next(err);
		}
	}

	public async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.id;
			const decodedUserId = req.body._id;
			await this.userService.deleteUser(userId, decodedUserId);
			ResponseHandler.sendResponse(res, 204);
		} catch (err) {
			next(err);
		}
	}

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const token = await this.userService.login(req.body);
			ResponseHandler.sendResponse(res, 200, "User logged in successfully", token);
		} catch (err) {
			next(err);
		}
	}
}

export default UserController;
