import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodSchema } from "zod";
class UserRequestValidator {
	private constructor() {}
	static validateUserSignup =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.body);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				res.status(400).json({ message: errorMessage });
			}
		};

	static validateUserLogin =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.body);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				res.status(400).json({ message: errorMessage });
			}
		};

	static validateGetUser =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.params);
				next();
			} catch (error) {
				console.log({ error });
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				res.status(400).json({ message: errorMessage });
			}
		};
}

export default UserRequestValidator;
