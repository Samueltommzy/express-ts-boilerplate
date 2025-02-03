import bcrypt from "bcrypt";
import { type Document, type Model, Schema, model } from "mongoose";
export interface IUser extends Document {
	_id: string;
	firstName: string;
	lastName: string;
	stripeCustomerId?: string;
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
	stripeCustomerId: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updateAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
	this.updateAt = new Date();
	// this.
	//hash password
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
});

UserSchema.methods.fullName = function (): string {
	return `${this.firstName} ${this.lastName}`;
};

export const User = model<IUser, UserModel>("User", UserSchema);
