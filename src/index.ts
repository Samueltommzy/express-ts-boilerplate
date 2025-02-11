import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import DatabaseConnection from "./config/Database";
import { consumerRunner } from "./kafka/consumers/runner";
import { Producer } from "./kafka/producer";

const port = process.env.PORT || 8080;
async function initDb() {
	const database = DatabaseConnection.getDatabaseInstance();
	await database.init();
}
initDb();
const server = app.listen(port, () => {
	try {
		console.log(`Server is running on http://localhost:${port}`);
	} catch (error) {
		console.error(`Unable to start server: ${error}`);
	}
});

(async () => {
	try {
		const kafkaProducer = new Producer();
		await kafkaProducer.start();
		console.log("Kafka producer started successfully");
	} catch (error) {
		console.error(`Unable to start kafka producer: ${error}`);
	}
	try {
		await consumerRunner();
		console.log("Consumers successfully initialized");
	} catch (error) {
		console.error(`Error initializing consumers: ${error}`);
	}
})();
const closeServer = async () => {
	server.close(() => {
		console.log("Server closed");
		process.exit();
	});
	setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);
