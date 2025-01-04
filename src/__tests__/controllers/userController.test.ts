import moongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import DatabaseConnection from "../../config/Database";
import { User } from "../../model";

beforeAll(async () => {
	// Database setup
	DatabaseConnection.initTestDb();
});

afterAll(async () => {
	// Database teardown
	DatabaseConnection.dropDatabase();
	DatabaseConnection.close();
});
describe("User controller operations", () => {
	describe("POST /user/signup", () => {
		test("should sign up a user using /user/signup endpoint", async () => {
			// Test implementation for signing up a user
			const userData = {
				_id: new moongoose.Types.ObjectId("6778627d2724c156d2a2a9e7"),
				firstName: "Sam",
				lastName: "testuser",
				password: "testpassword",
				email: "samsam@gmail.com",
			};
			const response = await request(app).post("/user/signup").send(userData);
			expect(response.status).toBe(200);
			const documentCount = await User.countDocuments({}).exec();
			expect(documentCount).toBe(1);
		});
	});

	describe("GET /user/:id", () => {
		test("should ge a user by id using /user/:id endpoint", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/6778627d2724c156d2a2a9e7");
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("firstName", "Sam");
			expect(response.body).toHaveProperty("lastName", "testuser");
			expect(response.body).toHaveProperty("email", "samsam@gmail.com");
		});
	});

	describe("GET /user/:id", () => {
		test("should return a 404 code when a wrong user id is provided", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/6778627d2724c156d2a2a9e9");
			expect(response.status).toBe(404);
		});
	});

	describe("GET /user/", () => {
		test("should return all users", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/");
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body).toHaveLength(1);
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
