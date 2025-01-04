import type { IUser } from "../model/User";
import { UserRepository } from "../repository";
interface IUserService {
	createUser: (user: IUser) => Promise<void>;
	getUser: (userId: string) => Promise<IUser | undefined>;
	getAllUsers: () => Promise<IUser[] | undefined>;
	login: () => void;
}

class UserService implements IUserService {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}
	public async createUser(user: IUser) {
		try {
			await this.userRepository.create(user);
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async getUser(userId: string): Promise<IUser | undefined> {
		try {
			const user = (await this.userRepository.findById(userId)) as IUser;
			return user;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async getAllUsers(): Promise<IUser[] | undefined> {
		try {
			const users = (await this.userRepository.findAll()) as IUser[];
			return users;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async login() {
		console.log("logged in inside service");
	}
}

export default UserService;
