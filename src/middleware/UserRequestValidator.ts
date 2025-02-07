import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodSchema } from "zod";
import { BadRequestException } from "../exceptions";
class UserRequestValidator {
	private constructor() {}
	static validateUserSignup =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.body);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				throw new BadRequestException(errorMessage);
			}
		};

	static validateUserUpdate =
		(bodySchema: ZodSchema, paramSchema: ZodSchema) =>
		(req: Request, res: Response, next: NextFunction) => {
			try {
				bodySchema.parse(req.body);
				paramSchema.parse(req.params);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				throw new BadRequestException(errorMessage);
			}
		};
	static validateUserLogin =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.body);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				throw new BadRequestException(errorMessage);
			}
		};

	static validateGetUser =
		(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse(req.params);
				next();
			} catch (error) {
				const errorMessage = `Invalid input: ${(error as ZodError).errors.map((err: any) => `${err.path[0]}->${err.message}`).join(", ")}`;
				throw new BadRequestException(errorMessage);
			}
		};
}

export default UserRequestValidator;
