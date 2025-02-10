type KafkaProducerMessage = {
	topic: string;
	message: KafkaMessage;
};

type KafkaConfigType = {
	clientId: string;
	brokers: string[];
	retry: {
		initialRetryTime: number;
		retries: number;
	};
};

type KafkaTopicType = {
	USER_CREATE: string;
	USER_UPDATE: string;
};

type TopicCreationConfigType = {
	waitForLeaders: boolean;
	timeout: number;
};

type TopicConfig = {
	topic: string;
	numberOfPartition: number;
	replicationFactor: number;
};

interface IKafkaConsumer {
	processMessage(topic: string, message: ProcessMessage): any;
	getConsumerClassName(): string;
}

type ConsumerConfigType = {
	maxConnectionCount: number;
};

type KafkaMessage = {
	key?: any;
	value: any;
};

type ProcessMessage = string | string[] | number;
export type {
	KafkaProducerMessage,
	KafkaConfigType,
	TopicCreationConfigType,
	ConsumerConfigType,
	ProcessMessage,
	TopicConfig,
	KafkaTopicType,
	IKafkaConsumer,
};
