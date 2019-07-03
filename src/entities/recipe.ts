import { prop as Property, arrayProp as ArrayProperty, Typegoose, Ref } from "typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

import { Rate } from "./rate";
import { User } from "./user";
import { getModel } from "@config/database";

@ObjectType()
export class Recipe extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field(_type => [Rate])
  @ArrayProperty({ items: Rate, default: [] })
  ratings: Rate[];

  @Field(_type => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;
}

export const RecipeModel = getModel(Recipe);
