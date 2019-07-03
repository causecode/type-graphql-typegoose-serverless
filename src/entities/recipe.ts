import { prop as Property, arrayProp as ArrayProperty, Typegoose, Ref, InstanceType } from "typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

import { Rate } from "./rate";
import { User } from "./user";
import { getModel, getConnection } from "@config/database";
import { Model } from "mongoose";

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

export let RecipeModel: Model<InstanceType<Recipe>>;

(async() => {
  RecipeModel = await getModel(Recipe);
})();
