import { KafkaConsumer } from 'node-rdkafka';
import {
  IKafkaConnector,
  KafkaConnectorConfig,
  KafkaMessage,
} from '../interfaces/kafka-connector.interface';

export class NodeRdKafkaConnector implements IKafkaConnector {
  private consumer: KafkaConsumer;
  private messageHandler: ((message: KafkaMessage) => Promise<void>) | null = null;
  private errorHandler: ((error: Error) => void) | null = null;

  constructor(private readonly config: KafkaConnectorConfig) {
    this.consumer = new KafkaConsumer(this.config.consumerConfig, this.config.topicConfig || {});
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.consumer.connect({}, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise(resolve => {
      this.consumer.disconnect(() => resolve());
    });
  }

  async subscribe(topics: string[]): Promise<void> {
    this.consumer.subscribe(topics);

    this.consumer.on('ready', () => {
      this.consumer.consume();
    });

    this.consumer.on('data', async message => {
      if (this.messageHandler) {
        await this.messageHandler({
          topic: message.topic,
          value: message.value ?? Buffer.from(''),
          partition: message.partition,
          offset: message.offset,
          timestamp: message.timestamp,
          key: message.key ?? undefined,
        });
      }
    });

    this.consumer.on('event.error', error => {
      if (this.errorHandler) {
        this.errorHandler(new Error(error.message));
      }
    });
  }

  onMessage(handler: (message: KafkaMessage) => Promise<void>): void {
    this.messageHandler = handler;
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandler = handler;
  }
}
