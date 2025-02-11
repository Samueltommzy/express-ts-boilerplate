import express from "express";
import { consumerRunner } from "./runner";

const consumers = express();
(async () => {
	try {
		await consumerRunner();
		console.log("Consumers successfully initialized");
	} catch (error) {
		console.error(`Error initializing consumers: ${error}`);
	}
})();
consumers.listen(8081, () => {
	console.log("Kafka consumer service is listening on port 8081");
});
