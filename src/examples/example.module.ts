import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka.module';
import { UserEventsController } from './controllers/user-events.controller';
import { OrderEventsController } from './controllers/order-events.controller';
import { NotificationEventsController } from './controllers/notification-events.controller';
import { CustomKafkaConnector } from './connectors/custom-kafka.connector';

@Module({
  imports: [
    // Example with default node-rdkafka connector
    KafkaModule.register({
      consumerConfig: {
        'group.id': 'example-service-group-1',
        'metadata.broker.list': 'localhost:9092',
        'socket.keepalive.enable': true,
      },
      topicConfig: {
        'auto.offset.reset': 'earliest',
      },
      handlers: [UserEventsController],
    }),

    // Example with custom connector
    KafkaModule.register({
      connector: new CustomKafkaConnector({
        consumerConfig: {
          'client.id': 'example-service',
          'group.id': 'example-service-group-2',
          'metadata.broker.list': 'localhost:9092',
        },
        topicConfig: {
          'auto.offset.reset': 'earliest',
        },
      }),
      handlers: [OrderEventsController, NotificationEventsController],
    }),
  ],
  controllers: [
    UserEventsController,
    OrderEventsController,
    NotificationEventsController,
  ],
})
export class ExampleModule {} 