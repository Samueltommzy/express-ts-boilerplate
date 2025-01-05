import BaseException from "./BaseException";

class HttpException extends BaseException {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = this.constructor.name;
	}
}
export default HttpException;
