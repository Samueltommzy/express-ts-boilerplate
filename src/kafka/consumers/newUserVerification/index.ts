import { consumerGroups, kafkaTopics } from "../../config";
import type { ProcessMessage } from "../../types";
import { BaseConsumer } from "../baseConsumer";

export class NewUserVerificationConsumer extends BaseConsumer {
	constructor() {
		super(consumerGroups.new_user_group_b, [kafkaTopics.USER_CREATE]);
	}

	getConsumerClassName(): string {
		return "NewUserVerificationConsumer";
	}

	async processMessage(topic: string, message: ProcessMessage): Promise<void> {
		console.log({ topic, message });
		console.info("New User verification");
	}
}
