import type { Request, Response } from "express";
import { userService } from "../service";

interface IUserController {
	// userService: UserService;
	createUser: (req: Request, res: Response) => void;
	login: (req: Request, res: Response) => void;
}
class UserController implements IUserController {
	private userService = userService;
	public async createUser(req: Request, res: Response) {
		await this.userService.createUser();
		console.log("created User in controller - ", req.body);
		res.status(200).json({ message: "User signed up successfully" });
	}
	public async login(req: Request, res: Response) {
		this.userService.login();
		console.log("logged in inside controller - ", req.body);
		res.status(200).json({ message: "User logged in successfully" });
	}
}

export default UserController;
