import { NodeRdKafkaConnector } from '../../../connectors/node-rdkafka.connector';
import { KafkaConsumer } from 'node-rdkafka';

const mockKafkaConsumer = {
  connect: jest.fn().mockImplementation((metadata, cb) => {
    if (typeof cb === 'function') {
      cb();
    }
    return Promise.resolve();
  }),
  disconnect: jest.fn().mockImplementation(cb => {
    if (typeof cb === 'function') {
      cb();
    }
    return Promise.resolve();
  }),
  subscribe: jest.fn().mockReturnValue(Promise.resolve()),
  consume: jest.fn(),
  on: jest.fn(),
};

jest.mock('node-rdkafka', () => ({
  KafkaConsumer: jest.fn().mockImplementation(() => mockKafkaConsumer),
}));

describe('NodeRdKafkaConnector', () => {
  let connector: NodeRdKafkaConnector;
  const mockConfig = {
    consumerConfig: {
      'bootstrap.servers': 'localhost:9092',
      'group.id': 'test-group',
    },
    topicConfig: {
      'auto.offset.reset': 'earliest',
    },
  };

  beforeEach(() => {
    connector = new NodeRdKafkaConnector(mockConfig);
  });

  describe('connect', () => {
    it('should create and connect a Kafka consumer', async () => {
      await connector.connect();
      expect(KafkaConsumer).toHaveBeenCalledWith(mockConfig.consumerConfig, mockConfig.topicConfig);
    });
  });

  describe('disconnect', () => {
    it('should disconnect the Kafka consumer', async () => {
      await connector.connect();
      await connector.disconnect();
      expect(mockKafkaConsumer.disconnect).toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to the given topics', async () => {
      const topics = ['test-topic-1', 'test-topic-2'];
      await connector.connect();
      await connector.subscribe(topics);
      expect(mockKafkaConsumer.subscribe).toHaveBeenCalledWith(topics);
    });
  });

  describe('onMessage', () => {
    it('should set up message handler', async () => {
      const handler = jest.fn();
      await connector.connect();
      connector.onMessage(handler);
      expect(mockKafkaConsumer.on).toHaveBeenCalledWith('data', expect.any(Function));
    });
  });

  describe('onError', () => {
    it('should set up error handler', async () => {
      const handler = jest.fn();
      await connector.connect();
      connector.onError(handler);
      expect(mockKafkaConsumer.on).toHaveBeenCalledWith('event.error', expect.any(Function));
    });
  });
});
