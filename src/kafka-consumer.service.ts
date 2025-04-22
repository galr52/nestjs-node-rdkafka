import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { KafkaConsumer } from 'node-rdkafka';
import { getKafkaHandlers } from './registry';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer!: KafkaConsumer;

  constructor(
    @Inject('KAFKA_HANDLER_CLASSES') private readonly handlerClasses: any[],
    @Inject('KAFKA_MODULE_OPTIONS') private readonly options: {
      consumerConfig: Record<string, any>;
      topicConfig?: Record<string, any>;
    },
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    const topicToHandler = getKafkaHandlers();
    const topics = Object.keys(topicToHandler);

    this.consumer = new KafkaConsumer(
      this.options.consumerConfig,
      this.options.topicConfig || {},
    );

    this.consumer.connect();

    this.consumer.on('ready', () => {
      this.consumer.subscribe(topics);
      this.consumer.consume();
    });

    this.consumer.on('data', async (message) => {
      const topic = message.topic;
      const payload = message.value?.toString();
      const handlerInfo = topicToHandler[topic];

      if (!handlerInfo) return;

      for (const { classRef, methodName } of handlerInfo) {
        const instance = this.moduleRef.get(classRef, { strict: false });
        await instance[methodName]?.call(instance, payload);
      }
    });

    this.consumer.on('event.error', (err) => {
      console.error('Kafka error:', err);
    });
  }

  onModuleDestroy() {
    this.consumer?.disconnect();
  }
}