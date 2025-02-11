import type { BaseConsumer } from "./baseConsumer";
import { NewUserNotificationConsumer } from "./newUserNotification";
import { NewUserVerificationConsumer } from "./newUserVerification";

const startConsumer = async (consumerClass: any, consumerInstances: Promise<void>[]) => {
	let consumer: BaseConsumer;
	try {
		consumer = new consumerClass();
		consumerInstances.push(consumer.start());
		console.log(`Started ${consumer.getConsumerClassName()}`);
	} catch (error) {
		console.error(`Unable to start consumer ${consumerClass}`);
	}
};

const consumerRunner = async () => {
	const consumerInstances: Promise<void>[] = [];
	const consumers = [NewUserNotificationConsumer, NewUserVerificationConsumer];

	for (const consumer of consumers) {
		//startConsumer
		await startConsumer(consumer, consumerInstances);
		console.log("Kafka Consumers running successfully");
	}
	try {
		await Promise.all(consumerInstances);
	} catch (error) {
		console.error(`Error running consumers: ${error}`);
	}
};

export { consumerRunner };
