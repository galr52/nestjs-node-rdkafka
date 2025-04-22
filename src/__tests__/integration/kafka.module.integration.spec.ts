import { Test } from '@nestjs/testing';
import { KafkaModule } from '../../kafka.module';
import { KafkaConsumerService } from '../../kafka-consumer.service';
import { TestingModule } from '@nestjs/testing';

class TestHandler {
  async handleMessage(message: string) {
    return message;
  }
}

describe('KafkaModule Integration', () => {
  let moduleRef: TestingModule;
  let consumerService: KafkaConsumerService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        KafkaModule.register({
          consumerConfig: {
            'bootstrap.servers': 'localhost:9092',
            'group.id': 'test-group',
          },
          handlers: [TestHandler],
        }),
      ],
    }).compile();

    consumerService = moduleRef.get(KafkaConsumerService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should initialize the module and connect to Kafka', async () => {
    expect(consumerService).toBeDefined();
    // Add more integration tests here
  });
});
