import { Module, DynamicModule } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';

interface KafkaModuleOptions {
  consumerConfig: Record<string, any>;
  topicConfig?: Record<string, any>;
  handlers: any[];
}

@Module({})
export class KafkaModule {
  static register(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        ...options.handlers,
        {
          provide: 'KAFKA_HANDLER_CLASSES',
          useValue: options.handlers,
        },
        {
          provide: 'KAFKA_MODULE_OPTIONS',
          useValue: options,
        },
        KafkaConsumerService,
      ],
      exports: [KafkaConsumerService],
    };
  }
}