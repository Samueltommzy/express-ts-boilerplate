import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
class TokenService {
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

	static generateToken = (userId: string): string => {
		const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});
		return token;
	};
}

export default TokenService;
