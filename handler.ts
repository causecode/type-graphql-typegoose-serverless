/*
 * 
 * 
 *
 * 
 */

import 'reflect-metadata';
import * as path from "path";

import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult, Callback } from 'aws-lambda';
import * as TypeGraphQL from 'type-graphql';
import { db } from '@config/database';
import { ObjectId } from 'bson';
import { ObjectIdScalar } from '@common/object-id.scalar';
import { TypegooseMiddleware } from '@common/TypegooseMiddleware';

import { UserResolver } from './src/user/UserResolver';
import { User } from './src/user/User.entity';

export interface UserContext {
  user: User;
}

async function getSchema() {
  return TypeGraphQL.buildSchema({
    resolvers: [UserResolver],
    // use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),

    // use ObjectId scalar mapping
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  });
}

async function bootstrap(event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) {
  const connection = db;
  connection.eventNames;
  // build TypeGraphQL executable schema
  if (process.env.IS_OFFLINE) {
    (global as any).TypeGraphQLMetadataStorage!.clear();
  }

  const schema = await getSchema();

  console.log('Schema: ', JSON.stringify(schema, null, 2));
  console.log('User Type: ', JSON.stringify(schema.getQueryType(), null, 2));

  const server = new ApolloServer({ schema });
  server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })(event, context, callback);
}

export function graphql(event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) {
  try {
    bootstrap(event, context, callback);
  } catch (e) {
    console.log('Error occured while boostrapping: ', JSON.stringify(e));
  }
}

export const playgroundHandler = lambdaPlayground({ endpoint: process.env.GRAPHQL_API_PATH });
