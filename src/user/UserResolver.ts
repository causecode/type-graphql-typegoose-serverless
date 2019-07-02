/*
 * 
 * 
 *
 * 
 */

import { Resolver, Mutation, Query, Arg } from 'type-graphql';
import { ObjectIdScalar } from '@common/object-id.scalar';
import { ObjectID } from 'bson';

import { User, UserModel } from './User.entity';
import { log } from '@config/logger';
import mongoose from 'mongoose';
import { promisify } from 'util';

@Resolver(_of => User)
export class UserResolver {
  constructor() {

  }
  
  @Query(_returns => User, { nullable: true })
  async user(@Arg('userId', _type => ObjectIdScalar) userId: ObjectID) {
    return await UserModel.findById(userId);
  }

  @Query(_returns => [User], { nullable: true })
  async users(): Promise<User[]>{
         
    log.debug(`Fetching users from the database. Models: ${JSON.stringify(mongoose.connection.modelNames())}`);
    try {
      
      const users = await UserModel.find({});
      log.debug(`Users from the database: ${JSON.stringify(users)}`)
      return users;
    } catch(e) {
      log.debug(`Database Error: ${JSON.stringify(e)}`);
      return [];
    } finally {
      log.debug(`Finishing up call to the database`);
    }
  }

  @Query(() => String)
  async hello() {
  
    return '1 + 1 = 2';
  }

  @Mutation(_returns => User)
  async login(@Arg('email') email: string, @Arg('password') _password: string) {
    const user = await UserModel.findOne({ email });
    return user ? true : false;
  }
}
