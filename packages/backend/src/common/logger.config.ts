import { LoggerModuleAsyncParams } from 'nestjs-pino';

const isProduction = process.env.NODE_ENV === 'production';

export const pinoLoggerConfig: LoggerModuleAsyncParams['useFactory'] = () => ({
  pinoHttp: {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    transport: isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
            messageFormat: '{req.method} {req.url} {res.statusCode} - {msg}',
            ignore: 'pid,hostname,req.headers,res.headers',
          },
        },
    // GCP Cloud Logging compatible format in production
    ...(isProduction && {
      formatters: {
        level: (label: string) => ({ severity: label.toUpperCase() }),
      },
    }),
  },
});
