import HttpException from "./HttpException";

class UniqueEmailViolationException extends HttpException {
	constructor() {
		super(409, "Email already exists, please try another email");
	}
}

export default UniqueEmailViolationException;
