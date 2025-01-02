import express, { type Express } from "express";
import routes from "./routes";
const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
