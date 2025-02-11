import { type Admin, type Consumer, Kafka, type Producer } from "kafkajs";
import { kafkaConfig, kafkaTopicsConfiguration, topicCreateConfig } from "../config";
import type { KafkaProducerMessage, TopicConfig } from "../types";

class KafkaService {
	private static instance: KafkaService;
	private kafka: Kafka;
	private isConnected: boolean;
	private isInitialized: boolean;
	private admin: Admin;
	private producer: Producer;

	private constructor() {
		this.isConnected = false;
		this.isInitialized = false;
		this.kafka = new Kafka({
			clientId: kafkaConfig.clientId,
			brokers: kafkaConfig.brokers,
			retry: kafkaConfig.retry,
		});
		this.admin = this.kafka.admin();
		this.producer = this.kafka.producer();
	}

	public static getInstance() {
		if (!KafkaService.instance) {
			KafkaService.instance = new KafkaService();
		}
		return KafkaService.instance;
	}

	public async start() {
		if (!this.isInitialized) {
			await this.connect();
			this.isInitialized = true;
		}
	}

	public async connect(): Promise<void> {
		try {
			await this.producer.connect();
			this.isConnected = true;
			await this.createTopics(kafkaTopicsConfiguration);
		} catch (error) {
			console.error(`Unable to connect to kafka: ${error}`);
			setTimeout(() => this.connect(), 5000);
		}
	}

	public async createTopics(topics: TopicConfig[]): Promise<void> {
		try {
			await this.admin.connect();
			const topicsToCreate: TopicConfig[] = [];
			for (const config of topics) {
				const topicName = config.topic;
				const alreadyExists = await this.topicExists(topicName);
				if (alreadyExists) {
					console.warn(`Topic ${topicName} already exists`);
					continue;
				}
				topicsToCreate.push(config);
			}
			if (topicsToCreate.length > 0) {
				await this.admin.createTopics({
					topics: topicsToCreate,
					waitForLeaders: topicCreateConfig.waitForLeaders,
					timeout: topicCreateConfig.timeout,
				});
			}
		} catch (error) {
			console.error(`Unable to create Topics: ${error}`);
			await this.admin.connect();
		} finally {
			await this.admin.disconnect();
		}
	}

	public async topicExists(topicName: string): Promise<boolean> {
		try {
			const { topics } = await this.admin.fetchTopicMetadata({
				topics: [topicName],
			});
			console.log({ topics });
			const topicMeta = topics?.find((topic) => topic.name == topicName);
			return !!topicMeta;
		} catch (error) {
			console.error(` Checking for topic existence failed: ${error}`);
			return false;
		}
	}

	public async produce(producerMessage: KafkaProducerMessage): Promise<void> {
		const { message, topic } = producerMessage;
		try {
			if (!this.isConnected) {
				this.connect();
				return;
			}
			await this.producer.send({
				topic,
				messages: [{ key: JSON.stringify(message.key), value: JSON.stringify(message.value) }],
			});
			console.log("message produced", JSON.stringify(message.value));
		} catch (error) {
			this.isConnected = false;
			this.connect();
			console.error(`Unable to produce message: ${error}`);
		}
	}

	public getConsumer(groupId: string): Consumer {
		return this.kafka.consumer({ groupId });
	}
}

export { KafkaService };
