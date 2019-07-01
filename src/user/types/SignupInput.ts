/*
 * 
 * 
 *
 * 
 */

import { InputType, Field } from 'type-graphql';

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
