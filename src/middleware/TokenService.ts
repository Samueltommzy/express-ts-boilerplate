import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnAuthenticatedException } from "../exceptions";
class TokenService {
	private constructor() {}
	static validateToken = (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				throw new UnAuthenticatedException("Token is missing in request header");
			}
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			req.body._id = (decoded as jwt.JwtPayload)._id;
			next();
		} catch (err) {
			throw new UnAuthenticatedException((err as Error).message);
		}
	};

	static generateToken = (userId: string): string => {
		const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});
		return token;
	};
}

export default TokenService;
