import { IKafkaConnector } from './kafka-connector.interface';

export interface KafkaModuleOptions {
  connector?: IKafkaConnector;
  consumerConfig?: Record<string, any>;
  topicConfig?: Record<string, any>;
  handlers: any[];
}
