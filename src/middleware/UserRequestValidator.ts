import type { NextFunction, Request, Response } from "express";

class UserRequestValidator {
	/**
	 * @description Validates user signup request
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 */
	private constructor() {}
	static validateUserSignup(req: Request, res: Response, next: NextFunction) {
		next();
	}

	static validateUserLogin(req: Request, res: Response, next: NextFunction) {
		next();
	}
}

export default UserRequestValidator;
