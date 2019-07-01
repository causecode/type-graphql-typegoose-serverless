/*
 * 
 * 
 *
 * 
 */

import mongoose from 'mongoose';

import { log } from './logger';

const dbConnectionURL = process.env.DBURL as string;

let connection;
let isPreviousConnectionAvailable = false;

export const db = (() => {
  if (!isPreviousConnectionAvailable) {
    log.debug('=> Creating a new database connection.');
    connection = mongoose.createConnection(dbConnectionURL, { useNewUrlParser: true });
    isPreviousConnectionAvailable = true;
  } else {
    log.debug('=> Reusing an existing database connection');
  }

  return connection as mongoose.Connection;
})();
