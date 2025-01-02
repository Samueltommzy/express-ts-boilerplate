import type { NextFunction, Request, Response } from "express";

class UserRequestValidator {
	private constructor() {}
	/**
	 * @description Validates user signup request
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 */
	static validateUserSignup(req: Request, res: Response, next: NextFunction) {
		next();
	}

	static validateUserLogin(req: Request, res: Response, next: NextFunction) {
		next();
	}
}

export default UserRequestValidator;
