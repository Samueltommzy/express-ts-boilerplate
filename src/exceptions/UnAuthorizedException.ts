import HttpException from "./HttpException";

class UnAuthorizedException extends HttpException {
	constructor(message: string) {
		super(403, message);
	}
}

export default UnAuthorizedException;
