import HttpException from "./HttpException";

class UnAuthenticatedException extends HttpException {
	constructor(message: string) {
		super(401, message);
	}
}

export default UnAuthenticatedException;
