import type { Response } from "express";

interface ResponseObject<T> {
	message?: string;
	status: number;
	data?: T;
}
class ResponseHandler {
	private constructor() {}

	public static sendResponse(response: Response, status: number, message?: string, data?: any) {
		const jsonResponse: ResponseObject<any> = {
			message,
			status,
			data,
		};
		response.status(status).json(jsonResponse);
	}
}

export default ResponseHandler;
