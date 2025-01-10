import mongoose from "mongoose";

class DatabaseConnection {
	private constructor() {}
	private isConnected = false;
	private static instance: DatabaseConnection;

	public static getDatabaseInstance(): DatabaseConnection {
		if (!DatabaseConnection.instance) {
			DatabaseConnection.instance = new DatabaseConnection();
		}
		return DatabaseConnection.instance;
	}
	public async init() {
		if (this.isConnected) {
			return;
		}
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

	public async initTestDb() {
		if (this.isConnected) {
			return;
		}
		try {
			await mongoose.connect(process.env.TEST_DB_URL || "mongodb://database:27017/test", {
				serverSelectionTimeoutMS: 30000,
				socketTimeoutMS: 30000,
			});
			this.isConnected = true;
		} catch (err: any) {
			throw new Error(err);
		}
	}

	public async dropDatabase() {
		try {
			if (this.isConnected) {
				await mongoose.connection.dropDatabase();
			}
		} catch (err) {
			// console.log(err);
		}
	}
	public async close() {
		if (this.isConnected) {
			await mongoose.disconnect();
			this.isConnected = false;
		}
	}
}

export default DatabaseConnection;
