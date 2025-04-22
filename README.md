# nestjs-rdkafka

A lightweight NestJS module for consuming Kafka messages using `node-rdkafka`, with a decorator-based API inspired by `@EventPattern`.

---

## 📦 Installation

```bash
npm install nestjs-node-rdkafka
```

---

## 🚀 Quick Start

### 1. Create a handler class

```ts
import { Controller } from '@nestjs/common';
import { KafkaHandler } from 'nestjs-rdkafka';

@Controller()
export class UserEventsController {
  @KafkaHandler('users-topic')
  handleUserCreated(message: string) {
    console.log('User event received:', message);
  }
}
```

### 2. Register the Kafka module

```ts
import { Module } from '@nestjs/common';
import { KafkaModule } from 'nestjs-rdkafka';
import { UserEventsController } from './user-events.controller';

@Module({
  imports: [
    KafkaModule.register({
      consumerConfig: {
        'group.id': 'my-group',
        'metadata.broker.list': 'localhost:9092',
      },
      topicConfig: {
        'auto.offset.reset': 'earliest',
      },
      handlers: [UserEventsController],
    }),
  ],
})
export class AppModule {}
```

---

## 🧰 API

### `KafkaModule.register(options)`

| Option           | Type                | Description                          |
|------------------|---------------------|--------------------------------------|
| `consumerConfig` | `object`            | Passed directly to `node-rdkafka` consumer |
| `topicConfig`    | `object` (optional) | Topic config for the consumer        |
| `handlers`       | `any[]`             | List of classes containing `@KafkaHandler()` methods |

---

### `@KafkaHandler(topic: string)`

Method decorator that binds a method to a Kafka topic. The method receives the raw string message payload.

---

## 🔄 Roadmap

- JSON deserialization
- DTO + class-validator support
- Message retry & error handling
- Middleware-like message interceptors

---

## 📄 License

MIT