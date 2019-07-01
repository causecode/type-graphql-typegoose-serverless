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

@Resolver(_of => User)
export class UserResolver {
  @Query(_returns => User, { nullable: true })
  async user(@Arg('userId', _type => ObjectIdScalar) userId: ObjectID) {
    return UserModel.findById(userId);
  }

  @Query(_returns => User, { nullable: true })
  async users() {
    return UserModel.find({});
  }

  @Mutation(_returns => User)
  async login(@Arg('email') email: string, @Arg('password') _password: string) {
    const user = await UserModel.findOne({ email });
    return user ? true : false;
  }
}
