import { userService } from "../service";

interface IUserController {
	// userService: UserService;
	createUser: () => void;
	login: () => void;
}
class UserController implements IUserController {
	private userService = userService;
	public async createUser() {
		await this.userService.createUser();
		console.log("created User in controller");
	}
	public async login() {
		this.userService.login();
		console.log("logged in inside controller");
	}
}

export default UserController;
