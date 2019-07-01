import { prop as Property, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class User extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  email: string;

  @Field()
  @Property()
  firstName?: string;

  @Field({ nullable: true })
  @Property()
  lastName?: string;

  @Property({ required: true })
  password: string;
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true, collection: 'user' },
});
