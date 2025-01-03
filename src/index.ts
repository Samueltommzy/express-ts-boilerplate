import app from "./app";
import DatabaseConnection from "./config/Database";

const port: number = 3000;
async function initDb() {
	await DatabaseConnection.init();
}
initDb();
const server = app.listen(3000, () => {
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
