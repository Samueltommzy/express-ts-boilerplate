import { type Model, Schema, model } from "mongoose";

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	createdAt?: Date;
	updateAt?: Date;
}

interface IUserMethods {
	fullName(): string;
}

type UserModel = Model<IUser, IUserMethods>;
const UserSchema = new Schema<IUser>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updateAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
	this.updateAt = new Date();
	next();
});

UserSchema.methods.fullName = function (): string {
	return `${this.firstName} ${this.lastName}`;
};

export const User = model<IUser, UserModel>("User", UserSchema);
