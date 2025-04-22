import { Module, DynamicModule } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaModuleOptions } from './interfaces/kafka-module-options.interface';
import { NodeRdKafkaConnector } from './connectors/node-rdkafka.connector';

@Module({})
export class KafkaModule {
  static register(options: KafkaModuleOptions): DynamicModule {
    if (!options.connector && !options.consumerConfig) {
      throw new Error('consumerConfig is required when using the default connector');
    }
    const connector =
      options.connector ||
      new NodeRdKafkaConnector({
        consumerConfig: options.consumerConfig!,
        topicConfig: options.topicConfig,
      });

    return {
      module: KafkaModule,
      providers: [
        ...options.handlers,
        {
          provide: 'KAFKA_HANDLER_CLASSES',
          useValue: options.handlers,
        },
        {
          provide: 'KAFKA_CONNECTOR',
          useValue: connector,
        },
        KafkaConsumerService,
      ],
      exports: [KafkaConsumerService],
    };
  }
}
