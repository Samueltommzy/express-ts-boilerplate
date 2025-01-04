import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
class TokenValidator {
	private constructor() {}
	static validateToken = (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				res.status(401).json({ message: "Token is missing in request header" });
				return;
			}
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			req.body._id = (decoded as jwt.JwtPayload)._id;
			next();
		} catch (err) {
			console.log({ err });
			res.status(401).json({ message: `Unauthorized - ${(err as Error).message}` });
		}
	};
}

export default TokenValidator;
