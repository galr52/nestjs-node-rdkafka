jest.mock('node-rdkafka', () => ({
  KafkaConsumer: jest.fn().mockImplementation(() => ({
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
  })),
}));
