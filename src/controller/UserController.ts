import type { Request, Response } from "express";
import type { IUser } from "../model";
import { UserService } from "../service";
interface IUserController {
	// userService: UserService;
	createUser: (req: Request, res: Response) => void;
	getUser: (req: Request, res: Response) => void;
	getAllUsers: (req: Request, res: Response) => void;
	login: (req: Request, res: Response) => void;
}
class UserController implements IUserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}
	public async createUser(req: Request, res: Response) {
		try {
			await this.userService.createUser(req.body);
			res.status(200).json({ message: "User signed up successfully" });
		} catch (err) {
			res.status(500).json({ message: (err as Error).message });
		}
	}

	public async getUser(req: Request, res: Response) {
		try {
			const user = (await this.userService.getUser(req.params.id)) as IUser;
			if (user == null) {
				res.status(404).json({ message: "User not found" });
				return;
			}
			if (req.body._id != user._id) {
				res.status(403).json({ message: "Cannot access this resource" });
				return;
			}
			res.status(200).json(user);
		} catch (err) {
			res.status(500).json({ message: (err as Error).message });
		}
	}

	public async getAllUsers(req: Request, res: Response) {
		try {
			const users = (await this.userService.getAllUsers()) as IUser[];
			res.status(200).json(users);
		} catch (err) {
			res.status(500).json({ message: (err as Error).message });
		}
	}

	public async login(req: Request, res: Response) {
		try {
			const token = await this.userService.login(req.body);
			res.status(200).json({ message: "User logged in successfully", token });
		} catch (err) {
			res.status(400).json({ message: (err as Error).message });
		}
	}
}

export default UserController;
