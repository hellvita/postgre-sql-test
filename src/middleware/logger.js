import pino from 'pino-http';
// use: npm install pino-http pino-pretty

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat:
        '{req.method} {req.url} {res.statusCode} - {responseTime} ms',
      hideObject: true,
    },
  },
});
