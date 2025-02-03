import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { Balance } from "./types";

class StripeClient {
	private readonly base_url: string;
	private secret: string;
	private axiosInstance: AxiosInstance;
	constructor(secret: string) {
		this.secret = secret;
		this.base_url = process.env.STRIPE_API_URL || "https://api.stripe.com/v1";
		axios.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
			return config;
		});
		axios.defaults.auth = {
			username: this.secret,
			password: "defined",
		};
		this.axiosInstance = axios;
	}

	public async getBalance(): Promise<Balance> {
		try {
			const response: Promise<Balance> = (await this.axiosInstance.get(`${this.base_url}/balance`))
				.data;
			return response;
		} catch (error) {
			// console.log({error});
			throw error;
		}
	}

	public async createCustomer(name: string, email: string): Promise<string | undefined> {
		try {
			const response = (
				await this.axiosInstance.post(
					`${this.base_url}/customers`,
					new URLSearchParams({ name, email }),
				)
			).data;
			return response.id;
		} catch (error) {
			console.log({ error });
			//implement retry logic here e.g publish to queue for retry
			throw error;
		}
	}

	public async deleteCustomer(customerId: string): Promise<void> {
		try {
			await this.axiosInstance.delete(`${this.base_url}/customers/${customerId}`);
		} catch (error) {
			throw error;
		}
	}
}

export default StripeClient;
