import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";
import { ResponseHandler } from "../utils";

const ErrorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof HttpException) {
		ResponseHandler.sendResponse(res, err.status, err.message);
		return;
	}
	ResponseHandler.sendResponse(res, 500, err.message);
};

export default ErrorHandler;
