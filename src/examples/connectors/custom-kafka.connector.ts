import {
  IKafkaConnector,
  KafkaConnectorConfig,
  KafkaMessage,
} from '../../interfaces/kafka-connector.interface';

// This is just an example of how to implement a custom connector
export class CustomKafkaConnector implements IKafkaConnector {
  private messageHandler: ((message: KafkaMessage) => Promise<void>) | null = null;
  private errorHandler: ((error: Error) => void) | null = null;
  private isConnected = false;

  constructor(private readonly config: KafkaConnectorConfig) {
    // Initialize your custom Kafka client here
    console.log('Initializing custom Kafka connector with config:', config);
  }

  async connect(): Promise<void> {
    // Implement your connection logic here
    this.isConnected = true;
    console.log('Custom Kafka connector connected');
  }

  async disconnect(): Promise<void> {
    // Implement your disconnection logic here
    this.isConnected = false;
    console.log('Custom Kafka connector disconnected');
  }

  async subscribe(topics: string[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Cannot subscribe before connecting');
    }

    console.log('Subscribing to topics:', topics);

    // Implement your subscription logic here
    // This is just an example that simulates receiving messages
    setInterval(() => {
      if (this.isConnected && this.messageHandler) {
        topics.forEach(topic => {
          const mockMessage: KafkaMessage = {
            topic,
            value: JSON.stringify({
              timestamp: new Date().toISOString(),
              data: `Mock message for ${topic}`,
            }),
          };
          this.messageHandler?.(mockMessage);
        });
      }
    }, 5000);
  }

  onMessage(handler: (message: KafkaMessage) => Promise<void>): void {
    this.messageHandler = handler;
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandler = handler;
  }
}
