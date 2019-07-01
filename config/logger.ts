/*
 * 
 * 
 *
 * 
 */

import * as logger from 'winston';

const level = process.env.LOG_LEVEL || 'debug';

export const log = logger;

log.configure({
  level,
  transports: [
    // Log everything to Console.
    new log.transports.Console({
      format: log.format.simple(), // for simpler format: `${info.level}: ${info.message} JSON.stringify({ ...rest })`
    }),
  ],
});
