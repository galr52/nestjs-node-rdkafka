import { KafkaModule } from '../../kafka.module';
import { KafkaConsumerService } from '../../kafka-consumer.service';
import { NodeRdKafkaConnector } from '../../connectors/node-rdkafka.connector';

describe('KafkaModule', () => {
  describe('register', () => {
    it('should throw an error when no connector or consumerConfig is provided', () => {
      expect(() => {
        KafkaModule.register({ handlers: [] });
      }).toThrow('consumerConfig is required when using the default connector');
    });

    it('should create a module with default connector when consumerConfig is provided', () => {
      const consumerConfig = { 'bootstrap.servers': 'localhost:9092' };
      const dynamicModule = KafkaModule.register({
        consumerConfig,
        handlers: [],
      });

      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(KafkaModule);
      expect(dynamicModule.providers).toContainEqual({
        provide: 'KAFKA_CONNECTOR',
        useValue: expect.any(NodeRdKafkaConnector),
      });
      expect(dynamicModule.providers).toContainEqual({
        provide: 'KAFKA_HANDLER_CLASSES',
        useValue: [],
      });
      expect(dynamicModule.providers).toContain(KafkaConsumerService);
      expect(dynamicModule.exports).toContain(KafkaConsumerService);
    });

    it('should create a module with custom connector when provided', () => {
      const customConnector = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        subscribe: jest.fn(),
        onMessage: jest.fn(),
        onError: jest.fn(),
      };

      const dynamicModule = KafkaModule.register({
        connector: customConnector,
        handlers: [],
      });

      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(KafkaModule);
      expect(dynamicModule.providers).toContainEqual({
        provide: 'KAFKA_CONNECTOR',
        useValue: customConnector,
      });
    });
  });
});
