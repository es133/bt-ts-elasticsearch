export const config  = {
  esClientService: {
    configuration: {
      nodes: [
        'http://es-node:9200'
      ],
      maxRetries: 3,
      requestTimeout: 30000,
    },
    index: {
      test: 'test',
    },
  }
};

