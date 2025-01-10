import dotenv from "dotenv";
import app from "./app";
import DatabaseConnection from "./config/Database";

dotenv.config();
const port: number = 3000;
async function initDb() {
	const database = DatabaseConnection.getDatabaseInstance();
	await database.init();
}
initDb();
const server = app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

const closeServer = async () => {
	server.close(() => {
		console.log("Server closed");
		process.exit();
	});
	setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);
