type HandlerEntry = {
  classRef: any;
  methodName: string;
};

const kafkaHandlers: Record<string, HandlerEntry[]> = {};

export function KafkaHandler(topic: string): MethodDecorator {
  return (target, propertyKey) => {
    const classRef = target.constructor;
    if (!kafkaHandlers[topic]) {
      kafkaHandlers[topic] = [];
    }
    kafkaHandlers[topic].push({
      classRef,
      methodName: propertyKey as string,
    });
  };
}

export function getKafkaHandlers() {
  return kafkaHandlers;
}
