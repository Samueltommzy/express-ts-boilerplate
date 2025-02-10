import type {
	ConsumerConfigType,
	KafkaConfigType,
	KafkaTopicType,
	TopicConfig,
	TopicCreationConfigType,
} from "../types";

const { KAFKA_CLIENT, KAFKA_BROKERS } = process.env;

const kafkaConfig: KafkaConfigType = {
	clientId: KAFKA_CLIENT ?? "",
	brokers: KAFKA_BROKERS ? KAFKA_BROKERS.split(",") : [],
	retry: {
		retries: 5,
		initialRetryTime: 1000,
	},
};

const topicCreateConfig: TopicCreationConfigType = {
	waitForLeaders: true,
	timeout: 1000,
};

const consumerConfig: ConsumerConfigType = {
	maxConnectionCount: 5,
};

const consumerGroups = {
	user_group_a: "user-group-a",
	user_group_b: "user-group-b",
};

const kafkaTopics: KafkaTopicType = (() => {
	const topics: KafkaTopicType = {
		USER_CREATE: "user_create",
		USER_UPDATE: "user_update",
	};
	return Object.fromEntries(Object.entries(topics).map(([k, v]) => [k, v])) as KafkaTopicType;
})();

const kafkaTopicsConfiguration: TopicConfig[] = [
	{
		topic: kafkaTopics.USER_CREATE,
		replicationFactor: 1,
		numberOfPartition: 1,
	},
	{
		topic: kafkaTopics.USER_UPDATE,
		replicationFactor: 1,
		numberOfPartition: 1,
	},
];

export {
	kafkaConfig,
	topicCreateConfig,
	consumerConfig,
	consumerGroups,
	kafkaTopics,
	kafkaTopicsConfiguration,
};
