import { type IUser, User } from "../model/User";

class UserRepository {
	/**
	 * @description Create a new user
	 * @param user
	 */
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

	public async update(id: string, user: IUser) {
		try {
			const updatedUser = await User.updateOne(
				{ _id: id },
				{ ...user, updateAt: new Date() },
			).exec();
			return updatedUser;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}

	public async delete(id: string) {
		try {
			await User.deleteOne({ _id: id }).exec();
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}
}

export default UserRepository;
