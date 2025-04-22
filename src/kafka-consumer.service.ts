import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IKafkaConnector } from './interfaces/kafka-connector.interface';
import { getKafkaHandlers } from './registry';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_HANDLER_CLASSES') private readonly handlerClasses: any[],
    @Inject('KAFKA_CONNECTOR') private readonly connector: IKafkaConnector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    const topicToHandler = getKafkaHandlers();
    const topics = Object.keys(topicToHandler);

    await this.connector.connect();
    
    this.connector.onMessage(async (message) => {
      const topic = message.topic;
      const payload = message.value?.toString();
      const handlerInfo = topicToHandler[topic];

      if (!handlerInfo) return;

      for (const { classRef, methodName } of handlerInfo) {
        const instance = this.moduleRef.get(classRef, { strict: false });
        await instance[methodName]?.call(instance, payload);
      }
    });

    this.connector.onError((error) => {
      console.error('Kafka error:', error);
    });

    await this.connector.subscribe(topics);
  }

  async onModuleDestroy() {
    await this.connector.disconnect();
  }
}