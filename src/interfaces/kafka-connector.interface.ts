export interface KafkaMessage {
  topic: string;
  value: string | Buffer;
  partition?: number;
  offset?: number;
  timestamp?: number;
  key?: string | Buffer;
  [key: string]: any;
}

export interface KafkaConnectorConfig {
  consumerConfig: Record<string, any>;
  topicConfig?: Record<string, any>;
}

export interface IKafkaConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(topics: string[]): Promise<void>;
  onMessage(handler: (message: KafkaMessage) => Promise<void>): void;
  onError(handler: (error: Error) => void): void;
}
