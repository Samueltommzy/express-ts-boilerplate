import { consumerGroups, kafkaTopics } from "../../config";
import type { ProcessMessage } from "../../types";
import { BaseConsumer } from "../baseConsumer";

export class NewUserNotificationConsumer extends BaseConsumer {
	constructor() {
		super(consumerGroups.new_user_group_a, [kafkaTopics.USER_CREATE, kafkaTopics.USER_UPDATE]);
	}

	getConsumerClassName(): string {
		return "NewUserNotificationConsumer";
	}

	async processMessage(topic: string, message: ProcessMessage): Promise<void> {
		console.log({ topic, message });
		console.info("Email Sent to user");
	}
}
