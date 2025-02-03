import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StripeClient } from "../apis";
import { HttpException, InvalidCredentialException } from "../exceptions";
import type { Login } from "../inputs/user";
import { TokenService } from "../middleware";
import type { LoginResponse } from "../model/Login";
import type { IUser } from "../model/User";
import { UserRepository } from "../repository";
interface IUserService {
	createUser: (user: IUser) => Promise<void>;
	getUser: (userId: string) => Promise<IUser | undefined>;
	getAllUsers: () => Promise<IUser[] | undefined>;
	login: (input: Login) => Promise<LoginResponse>;
}

class UserService implements IUserService {
	private userRepository: UserRepository;
	private stripeClient: StripeClient;
	constructor() {
		this.userRepository = new UserRepository();
		this.stripeClient = new StripeClient(process.env.STRIPE_SECRET_KEY || "");
	}
	public async createUser(user: IUser) {
		try {
			//hash user password
			const name = `${user.firstName} + " " + ${user.lastName}`;
			const email = user.email;
			const stripeId = await this.stripeClient.createCustomer(name, email);
			if (stripeId) {
				user.stripeCustomerId = stripeId;
				await this.userRepository.create(user);
			}
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

	public async login(input: Login): Promise<LoginResponse> {
		try {
			const user = await this.userRepository.findByEmail(input.email);
			if (!user) {
				throw new InvalidCredentialException("Invalid email or password, please try again");
			}
			const isValidPassword = bcrypt.compareSync(input.password, user.password);
			if (!isValidPassword) {
				throw new InvalidCredentialException("Invalid email or password, please try again");
			}
			const token = TokenService.generateToken(user._id);
			const balance = await this.stripeClient.getBalance();
			return { token, balance };
		} catch (err) {
			if (err instanceof InvalidCredentialException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}
}

export default UserService;
