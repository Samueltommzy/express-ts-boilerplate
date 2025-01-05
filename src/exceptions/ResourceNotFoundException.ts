import HttpException from "./HttpException";

class ResourceNotFoundException extends HttpException {
	constructor(message: string) {
		super(404, message);
	}
}

export default ResourceNotFoundException;
