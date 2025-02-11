import { KafkaService } from "../service/kafkaService";
import type { KafkaProducerMessage } from "../types";

class Producer {
	private kafkaService: KafkaService;

	constructor() {
		this.kafkaService = KafkaService.getInstance();
	}

	async start() {
		await this.kafkaService.start();
	}

	async produce(producerMessage: KafkaProducerMessage) {
		if (this.kafkaService) {
			await this.kafkaService.produce(producerMessage);
		} else {
			console.warn("Kafka service is not initialized");
		}
	}
}

export { Producer };
