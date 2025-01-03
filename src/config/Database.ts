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
			await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test", {});
		} catch (err) {
			console.log(err);
		}
	}
}

export default DatabaseConnection;
