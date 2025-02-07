import mongoose from "mongoose";

class DatabaseConnection {
	private constructor() {}
	private isConnected = false;
	private static instance: DatabaseConnection;
	private DB_PASSWORD = process.env.DB_PASSWORD;
	private DB_USER = process.env.DB_USER;
	private DEV_DB_URL = process.env.DEV_DB_URL;
	private TEST_DB_URL = process.env.TEST_DB_URL;
	private readonly devDbUrl =
		`mongodb+srv://${this.DB_USER}:${this.DB_PASSWORD}@${this.DEV_DB_URL}`;
	private readonly testDbUrl =
		`mongodb+srv://${this.DB_USER}:${this.DB_PASSWORD}@${this.TEST_DB_URL}`;

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
			await mongoose.connect(this.devDbUrl, { dbName: "dev" });
		} catch (err) {
			console.log(err);
		}
	}

	public async initTestDb() {
		if (this.isConnected) {
			return;
		}
		try {
			await mongoose.connect(this.testDbUrl, {
				serverSelectionTimeoutMS: 30000,
				socketTimeoutMS: 30000,
				dbName: "test",
			});
			this.isConnected = true;
		} catch (err: any) {
			throw new Error(err);
		}
	}

	public async dropAllCollections() {
		try {
			const collections = await mongoose.connection.db?.collections();
			if (collections?.length) {
				for (const collection of collections) {
					await collection.drop();
				}
			}
		} catch (err) {}
	}

	public async close() {
		if (this.isConnected) {
			await mongoose.disconnect();
			this.isConnected = false;
		}
	}
}

export default DatabaseConnection;
