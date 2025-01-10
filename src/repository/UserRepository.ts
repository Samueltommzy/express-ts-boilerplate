import { UniqueEmailViolationException } from "../exceptions";
import { type IUser, User } from "../model/User";

class UserRepository {
	/**
	 * @description Create a new user
	 * @param user
	 */
	private users = new Map<string, IUser>();
	private emails = new Set<string>();
	private currentId = 1;
	constructor() {
		const defaultUser: IUser = {
			_id: "1",
			firstName: "John",
			lastName: "Doe",
			email: "j.doe@gmail.com",
			password: "johnDoe",
		};
		this.users.set("1", defaultUser);
		this.emails.add(defaultUser.email);
	}

	private getUserId(): string {
		this.currentId++;
		return this.currentId.toString();
	}
	public addUser(user: IUser): void {
		if (this.emails.has(user.email)) {
			throw new UniqueEmailViolationException();
		}
		user._id = this.getUserId();
		user.createdAt = new Date();
		user.updateAt = new Date();
		this.users.set(user._id, user);
		this.emails.add(user.email);
	}

	public getUserById(userId: string): IUser | undefined {
		const user = this.users.get(userId);
		return user;
	}

	public getUserByEmail(email: string): IUser | undefined {
		if (!this.emails.has(email)) {
			return undefined;
		}
		for (const user of this.users.values()) {
			if (user.email == email) {
				return user;
			}
		}
	}

	public getAllUsers(): Map<string, IUser> {
		return this.users;
	}

	public async create(user: IUser): Promise<void> {
		try {
			const newUser = new User(user);
			await newUser.save();
		} catch (err: any) {
			throw new Error((err as Error).message);
		}
	}
	public async findById(userId: string) {
		try {
			const user = await User.findById(userId, { password: 0, __v: 0 }).exec();
			return user;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async findByEmail(email: string) {
		try {
			const user = await User.findOne({ email }).exec();
			return user;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async findAll() {
		try {
			const users = await User.find({}, { password: 0, __v: 0 }).exec();
			return users;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}
}

export default UserRepository;
