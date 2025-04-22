import { Test } from '@nestjs/testing';
import { KafkaConsumerService } from '../../kafka-consumer.service';
import { ModuleRef } from '@nestjs/core';
import { getKafkaHandlers } from '../../registry';

jest.mock('../../registry', () => ({
  getKafkaHandlers: jest.fn(),
}));

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let mockConnector: any;
  let mockModuleRef: any;
  let mockHandlers: any[];

  beforeEach(async () => {
    mockConnector = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockResolvedValue(undefined),
      onMessage: jest.fn(),
      onError: jest.fn(),
    };

    mockHandlers = [
      {
        handleMessage: jest.fn().mockResolvedValue(undefined),
      },
    ];

    mockModuleRef = {
      get: jest.fn().mockReturnValue(mockHandlers[0]),
    };

    // Mock the registry to return our test handlers
    (getKafkaHandlers as jest.Mock).mockReturnValue({
      'test-topic': [
        {
          classRef: mockHandlers[0].constructor,
          methodName: 'handleMessage',
        },
      ],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: 'KAFKA_HANDLER_CLASSES',
          useValue: mockHandlers,
        },
        {
          provide: 'KAFKA_CONNECTOR',
          useValue: mockConnector,
        },
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
      ],
    }).compile();

    service = moduleRef.get<KafkaConsumerService>(KafkaConsumerService);
  });

  describe('onModuleInit', () => {
    it('should connect to Kafka and set up message handler', async () => {
      await service.onModuleInit();

      expect(mockConnector.connect).toHaveBeenCalled();
      expect(mockConnector.onMessage).toHaveBeenCalled();
      expect(mockConnector.onError).toHaveBeenCalled();
      expect(mockConnector.subscribe).toHaveBeenCalled();
    });

    it('should handle incoming messages correctly', async () => {
      const mockMessage = {
        topic: 'test-topic',
        value: Buffer.from('test message'),
      };

      await service.onModuleInit();
      const messageHandler = mockConnector.onMessage.mock.calls[0][0];
      await messageHandler(mockMessage);

      expect(mockModuleRef.get).toHaveBeenCalledWith(mockHandlers[0].constructor, {
        strict: false,
      });
      expect(mockHandlers[0].handleMessage).toHaveBeenCalledWith('test message');
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from Kafka', async () => {
      await service.onModuleDestroy();
      expect(mockConnector.disconnect).toHaveBeenCalled();
    });
  });
});
