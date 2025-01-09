import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";

const ErrorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof HttpException) {
		res.status(err.status).json({ message: err.message });
		return;
	}
	res.status(500).json({ message: err.message });
};

export default ErrorHandler;
