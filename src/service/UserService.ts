import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpException, InvalidCredentialException } from "../exceptions";
import type { Login } from "../inputs/user";
import { TokenService } from "../middleware";
import type { IUser } from "../model/User";
import { UserRepository } from "../repository";
interface IUserService {
	createUser: (user: IUser) => Promise<void>;
	addUser: (user: IUser) => void;
	findUser: (userId: string) => IUser | undefined;
	findAllUsers: () => Map<string, IUser>;
	getUser: (userId: string) => Promise<IUser | undefined>;
	getAllUsers: () => Promise<IUser[] | undefined>;
	login: (input: Login) => Promise<string>;
}

class UserService implements IUserService {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}
	public addUser(user: IUser) {
		this.userRepository.addUser(user);
	}

	public findUser(userId: string): IUser | undefined {
		return this.userRepository.getUserById(userId);
	}
	public findAllUsers(): Map<string, IUser> {
		return this.userRepository.getAllUsers();
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
			// const user = await this.userRepository.findByEmail(input.email);
			const user = this.userRepository.getUserByEmail(input.email);
			if (!user) {
				throw new InvalidCredentialException("Invalid email or password, please try again");
			}
			// const isValidPassword = bcrypt.compareSync(input.password, user.password);
			const isValidPassword = input.password == user.password;
			if (!isValidPassword) {
				throw new InvalidCredentialException("Invalid email or password, please try again");
			}
			const token = TokenService.generateToken(user._id);
			return token;
		} catch (err) {
			if (err instanceof InvalidCredentialException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}
}

export default UserService;
