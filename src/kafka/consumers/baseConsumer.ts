import type { Consumer } from "kafkajs";
import { consumerConfig } from "../config";
import { KafkaService } from "../service/kafkaService";
import type { IKafkaConsumer, ProcessMessage } from "../types";

class BaseConsumer implements IKafkaConsumer {
	private kafkaService: KafkaService;
	private consumer: Consumer;
	private retryCount: number;
	private groupId: string;
	private topics: string[];
	constructor(groupId: string, topics: string[]) {
		this.retryCount = 0;
		this.groupId = groupId;
		this.topics = topics;
		this.kafkaService = KafkaService.getInstance();
		this.consumer = this.kafkaService.getConsumer(this.groupId);
	}

	async start() {
		await this.connect();
	}
	private async connect() {
		try {
			await this.consumer.connect();
			for (const topic of this.topics) {
				await this.consumer.subscribe({
					topic: topic,
					fromBeginning: true,
				});
				console.log(`subscribed to topic ${topic}`);
			}

			await this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					console.log("message received", {
						topic,
						message,
						partition,
					});
					const messageValue = message?.value?.toString();
					const messageObj: ProcessMessage = messageValue ? JSON.parse(messageValue) : "";
					await this.processMessage(topic, messageObj);
				},
			});
		} catch (error) {
			this.retryCount++;
			if (this.retryCount == consumerConfig.maxRetryCount) {
				console.log(`Failed to connect to kafka consumer: ${error}`);
				return;
			}

			console.log(`Failed to connect to kafka consumer ,Retrying ${this.retryCount} ....`);
			setTimeout(() => this.connect, 5000);
		}
	}
	async processMessage(topic: string, message: ProcessMessage) {
		throw new Error("Method not implemented.");
	}
	getConsumerClassName(): string {
		throw new Error("Method not implemented.");
	}
}

export { BaseConsumer };
