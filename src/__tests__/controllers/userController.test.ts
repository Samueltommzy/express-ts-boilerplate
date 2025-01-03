import request from "supertest";
import app from "../../app";
describe("User controller operations", () => {
	describe("POST /user/signup", () => {
		test("should sign up a user using /user/signup endpoint", async () => {
			// Test implementation for signing up a user
			const userData = {
				username: "testuser",
				password: "testpassword",
				email: "samsam@gmail.com",
			};
			const response = await request(app).post("/user/signup").send(userData);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("message", "User signed up successfully");
		});
	});
	describe("GET /login", () => {
		test("should log a user in using /user/login endpoint", async () => {
			// Test implementation for logging in a user
			const userData = {
				username: "testuser",
				password: "testpassword",
			};
			const response = await request(app).post("/user/login").send(userData);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("message", "User logged in successfully");
		});
	});
});
