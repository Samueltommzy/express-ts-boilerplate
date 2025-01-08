import mongoose from "mongoose";

class DatabaseConnection {
	private constructor() {}
	public static async init() {
		try {
			mongoose.connection.on("connected", () => console.log("Connected to database"));
			mongoose.connection.on("open", () => console.log("open"));
			mongoose.connection.on("disconnected", () => console.log("disconnected"));
			mongoose.connection.on("reconnected", () => console.log("reconnected"));
			mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
			mongoose.connection.on("close", () => console.log("close"));
			await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/dev", {});
		} catch (err) {
			console.log(err);
		}
	}

	public static async initTestDb() {
		try {
			mongoose.connection.on("connected", () => console.log("Connected to test database"));
			mongoose.connection.on("open", () => console.log("open"));
			// mongoose.connection.on("disconnected", () => console.log("disconnected"));
			await mongoose.connect(process.env.TEST_DB_URL || "mongodb://database:27017/test", {});
		} catch (err) {
			console.log(err);
		}
	}

	public static async dropDatabase() {
		try {
			await mongoose.connection.dropDatabase();
		} catch (err) {
			console.log(err);
		}
	}
	public static async close() {
		await mongoose.connection.close();
	}
}

export default DatabaseConnection;
