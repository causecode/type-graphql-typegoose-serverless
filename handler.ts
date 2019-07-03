/*
 *
 *
 *
 *
 */

import 'reflect-metadata';

import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult, Callback, APIGatewayEvent } from 'aws-lambda';
import * as TypeGraphQL from 'type-graphql';
import { getConnection } from '@config/database';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '@common/object-id.scalar';
import { TypegooseMiddleware } from '@common/TypegooseMiddleware';
import { log } from '@config/logger';
import { RecipeResolver } from './src/resolvers/recipe-resolver';
import { RateResolver } from './src/resolvers/rate-resolver';

async function getSchema() {
  log.debug('Inside get Schema');
  try {
    return await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver, RateResolver],
      // use document converting middleware
      globalMiddlewares: [TypegooseMiddleware],
      // emitSchemaFile: path.resolve(__dirname, 'schema.graphql'), for some reason specifying path fails

      emitSchemaFile: {},
      // use ObjectId scalar mapping
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    });
  } catch (e) {
    log.debug('Error at get Schema');
    log.error(`Error occured while boostrapping: , ${JSON.stringify(e, null, 2)}`);
    throw e;
  } finally {
    log.debug('Finish get Schema');
  }
}

const createHandler = async () => {
  getConnection();

  log.debug('About to generate schema: ');
  (global as any).schema = (global as any).schema || (await getSchema());
  const schema = (global as any).schema;

  log.debug('Schema: ', JSON.stringify(schema, null, 2));
  log.debug('User Type: ', JSON.stringify(schema.getQueryType(), null, 2));

  const server = new ApolloServer({
    schema,
    context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
      context.callbackWaitsForEmptyEventLoop = false;
      return { auth: { isAuthenticated: false } };
    },

  });
  return server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } });
};

export const graphql = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
  createHandler().then(handler => handler(event, context, callback));
};

export const playgroundHandler = lambdaPlayground({ endpoint: process.env.GRAPHQL_API_PATH });
