import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Login } from "../inputs/user";
import type { IUser } from "../model/User";
import { UserRepository } from "../repository";
interface IUserService {
	createUser: (user: IUser) => Promise<void>;
	getUser: (userId: string) => Promise<IUser | undefined>;
	getAllUsers: () => Promise<IUser[] | undefined>;
	login: (input: Login) => Promise<string>;
}

class UserService implements IUserService {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}
	public async createUser(user: IUser) {
		try {
			//hash user password
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

	public async login(input: Login): Promise<string> {
		try {
			const user = await this.userRepository.findByEmail(input.email);
			if (!user) {
				throw new Error("Invalid email or password, please try again");
			}
			const isValidPassword = bcrypt.compareSync(input.password, user.password);
			if (!isValidPassword) {
				throw new Error("Invalid email or password, please try again");
			}
			const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
				expiresIn: "1h",
			});
			return token;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}
}

export default UserService;
