class UserService {
	// constructor() {
	// }
	public async createUser() {
		console.log("createUser in service");
	}
	public async login() {
		console.log("logged in inside service");
	}
}

export const userService = new UserService();
