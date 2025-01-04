import { z } from "zod";
export const CreateUserInput = z.object({
	firstName: z.string().min(2).max(255),
	lastName: z.string().min(2).max(255),
	email: z.string().email(),
	password: z.string().min(8).max(255),
});

export const LoginInput = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(255),
});

export type Login = z.infer<typeof LoginInput>;

export const GetUserInput = z.object({
	id: z.string(),
});
