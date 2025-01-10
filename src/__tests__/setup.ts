import DatabaseConnection from "../config/Database";

const database = DatabaseConnection.getDatabaseInstance();

beforeAll(async () => {
	await database.initTestDb();
}, 30000);

afterAll(async () => {
	await database.dropDatabase();
	await database.close();
}, 30000);
