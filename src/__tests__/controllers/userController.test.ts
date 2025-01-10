import jwt from "jsonwebtoken";
import moongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { User } from "../../model";

import DatabaseConnection from "../../config/Database";

const database = DatabaseConnection.getDatabaseInstance();

beforeAll(async () => {
	await database.initTestDb();
}, 30000);

afterAll(async () => {
	await database.dropDatabase();
	await database.close();
}, 30000);

describe("User controller operations", () => {
	const token = jwt.sign({ _id: "6778627d2724c156d2a2a9e7" }, process.env.JWT_SECRET as string);
	const invalidToken = jwt.sign(
		{ _id: "6778627d2724c156d2a2a9e8" },
		process.env.JWT_SECRET as string,
	);
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
			expect(response.status).toBe(201);
			const documentCount = await User.countDocuments({}).exec();
			expect(documentCount).toBe(1);
		});
	});

	describe("GET /user/:id", () => {
		test("should get a user by id using /user/:id endpoint provided a valid token is provided in request header", async () => {
			// Test implementation for getting a user
			const response = await request(app)
				.get("/user/6778627d2724c156d2a2a9e7")
				.set("Authorization", `Bearer ${token}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("firstName", "Sam");
			expect(response.body.data).toHaveProperty("lastName", "testuser");
			expect(response.body.data).toHaveProperty("email", "samsam@gmail.com");
		});
	});

	describe("GET /user/:id", () => {
		test("should deny access to retrieving a user using invalid token", async () => {
			// Test implementation for getting a user
			const response = await request(app)
				.get("/user/6778627d2724c156d2a2a9e7")
				.set("Authorization", `Bearer ${invalidToken}`);
			expect(response.status).toBe(403);
			expect(response.body).toHaveProperty("message", "You are not authorized to view this user");
		});
	});

	describe("GET /user/:id", () => {
		test("should return unauthorized error access when making request without token", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/6778627d2724c156d2a2a9e8");
			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "Token is missing in request header");
		});
	});

	describe("GET /user/:id", () => {
		test("should return a 404 code when a wrong user id is provided", async () => {
			// Test implementation for getting a user
			const response = await request(app)
				.get("/user/6778627d2724c156d2a2a9e9")
				.set("Authorization", `Bearer ${token}`);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "User not found");
		});
	});

	describe("GET /user/", () => {
		test("should return all users", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/").set("Authorization", `Bearer ${token}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.data).toHaveLength(1);
		});
	});

	describe("GET /user/", () => {
		test("should return unauthorized error if no token is provided", async () => {
			// Test implementation for getting a user
			const response = await request(app).get("/user/");
			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "Token is missing in request header");
		});
	});

	describe("POST /login", () => {
		test("should log a user in using /user/login endpoint", async () => {
			const userData = {
				email: "samsam@gmail.com",
				password: "testpassword",
			};
			const response = await request(app).post("/user/login").send(userData);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("message", "User logged in successfully");
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("token");
		});
	});
});
