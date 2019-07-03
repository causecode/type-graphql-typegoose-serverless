/*
 * 
 * 
 *
 * 
 */

import mongoose from 'mongoose';

import { log } from './logger';
import { Typegoose } from 'typegoose';

const dbConnectionURL = process.env.DBURL as string;

let isPreviousConnectionAvailable = false;

export const getConnection = (() => {
  if (!isPreviousConnectionAvailable) {
    log.debug(`=> Creating a new database connection: ${dbConnectionURL}`);
     const connection = mongoose.createConnection(dbConnectionURL, { useNewUrlParser: true });
    mongoose.set('debug', true);
    isPreviousConnectionAvailable = true;
    return connection;
  } else {
    log.debug('=> Reusing an existing database connection');
  }
  return mongoose.connection;
});

export function getModel<T extends Typegoose>(Model: new () => T) {
  const connection = getConnection();
  const DomainModel = new Model().getModelForClass(Model, {
    existingConnection: connection
  });
  
  return DomainModel;
}
