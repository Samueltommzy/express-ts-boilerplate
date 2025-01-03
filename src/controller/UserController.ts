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
			console.log("created User in controller - ", req.body);
			res.status(200).json({ message: "User signed up successfully" });
		} catch (err: any) {
			res.status(500).json({ message: err.message });
		}
	}

	public async getUser(req: Request, res: Response) {
		try {
			console.log({ id: req.params.id });
			const user = (await this.userService.getUser(req.params.id)) as IUser;
			if (user == null) {
				res.status(404).json({ message: "User not found" });
				return;
			}
			console.log("get User in controller - ", user);
			res.status(200).json(user);
		} catch (err) {
			console.log(err);
		}
	}

	public async getAllUsers(req: Request, res: Response) {
		try {
			const users = (await this.userService.getAllUsers()) as IUser[];
			console.log("get all Users in controller - ", users);
			res.status(200).json(users);
		} catch (err) {
			console.log(err);
		}
	}

	public async login(req: Request, res: Response) {
		try {
			this.userService.login();
			console.log("logged in inside controller - ", req.body);
			res.status(200).json({ message: "User logged in successfully" });
		} catch (err) {
			console.log(err);
		}
	}
}

export default UserController;
