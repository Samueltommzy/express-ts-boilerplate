import { StripeClient } from "../../apis";
import type { IStripeClientAPI } from "../../apis/stripe/StripeClient";

let stripeApiClient: IStripeClientAPI;
let stripeCustomer = "";
beforeAll(async () => {
	stripeApiClient = new StripeClient(process.env.STRIPE_SECRET_KEY || "");
});

afterAll(() => {
	// if(stripeCustomer.length > 0){
	// }
});

describe("Stripe client Api Test", () => {
	test("Should create a stripe customer", async () => {
		const customer = await stripeApiClient.createCustomer("Test User", "test@gmail.com");
		stripeCustomer = customer ?? "";

		expect(customer).toBeTruthy();
	});

	test("Should get user balance", async () => {
		const balance = await stripeApiClient.getBalance();
		expect(balance).toHaveProperty("object", "balance");
		expect(balance).toHaveProperty("available");
		expect(balance).toHaveProperty("livemode");
		expect(balance.livemode).toBeDefined();
	});

	test("Should delete stripe customer", async () => {
		const response = await stripeApiClient.deleteCustomer(stripeCustomer);
		expect(response).toBeTruthy();
		expect(response).toBe("success");
	});
});
