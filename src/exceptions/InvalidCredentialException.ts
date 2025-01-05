import HttpException from "./HttpException";

class InvalidCredentialException extends HttpException {
	constructor(message: string) {
		super(401, message);
	}
}

export default InvalidCredentialException;
