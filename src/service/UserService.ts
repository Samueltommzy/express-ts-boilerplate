import bcrypt from "bcrypt";
import { StripeClient } from "../apis";
import {
	HttpException,
	InvalidCredentialException,
	ResourceNotFoundException,
	UnAuthorizedException,
} from "../exceptions";
import type { Login } from "../inputs/user";
import { TokenService } from "../middleware";
import type { LoginResponse } from "../model/Login";
import type { IUser } from "../model/User";
import { UserRepository } from "../repository";
interface IUserService {
	createUser: (user: IUser) => Promise<string | null>;
	getUser: (userId: string, decodedUserId: string) => Promise<IUser | undefined>;
	getAllUsers: () => Promise<IUser[] | undefined>;
	updateUser: (userId: string, decodedUserId: string, user: IUser) => Promise<IUser>;
	deleteUser: (userId: string, decodedUserId: string) => Promise<void>;
	login: (input: Login) => Promise<LoginResponse>;
}

class UserService implements IUserService {
	private userRepository: UserRepository;
	private stripeClient: StripeClient;
	constructor() {
		this.userRepository = new UserRepository();
		this.stripeClient = new StripeClient(process.env.STRIPE_SECRET_KEY || "");
	}
	public async createUser(user: IUser): Promise<string | null> {
		try {
			//hash user password
			const name = `${user.firstName}  ${user.lastName}`;
			const email = user.email;
			const stripeId = await this.stripeClient.createCustomer(name, email);
			if (stripeId) {
				user.stripeCustomerId = stripeId;
				await this.userRepository.create(user);
			}
			return stripeId ?? null;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async getUser(userId: string, decodedUserId: string): Promise<IUser | undefined> {
		try {
			const user = (await this.userRepository.findById(userId)) as IUser;
			if (user == null) {
				throw new ResourceNotFoundException("User not found");
			}
			if (user.id != decodedUserId) {
				throw new UnAuthorizedException("You are not authorized to view this user");
			}
			return user;
		} catch (err) {
			if (err instanceof HttpException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}

	public async getAllUsers(): Promise<IUser[] | undefined> {
		try {
			const users = (await this.userRepository.findAll()) as IUser[];
			return users;
		} catch (err) {
			if (err instanceof HttpException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}

	public async updateUser(userId: string, decodedUserId: string, user: IUser): Promise<IUser> {
		try {
			await this.getUser(userId, decodedUserId);
			// if(!userData){
			// 	throw new ResourceNotFoundException("User not found");
			// }
			await this.userRepository.update(userId, user);
			return (await this.userRepository.findById(userId)) as IUser;
		} catch (err) {
			if (err instanceof HttpException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}

	public async deleteUser(userId: string, decodedUserId: string) {
		try {
			const user = await this.getUser(userId, decodedUserId);
			// if(!userData){
			// 	throw new ResourceNotFoundException("User not found");
			// }
			if (user?.stripeCustomerId) {
				await this.stripeClient.deleteCustomer(user.stripeCustomerId);
			}
			await this.userRepository.delete(userId);
		} catch (err) {
			if (err instanceof HttpException) {
				throw err;
			}
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
			if (err instanceof HttpException) {
				throw err;
			}
			throw new Error((err as Error).message);
		}
	}
}

export default UserService;
