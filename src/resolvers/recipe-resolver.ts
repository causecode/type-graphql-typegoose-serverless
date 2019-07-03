import { ObjectId } from "mongodb";
import { Resolver, Query, FieldResolver, Arg, Root, Mutation, Ctx } from "type-graphql";

import { Recipe, RecipeModel } from "../entities/recipe";
import { Rate } from "../entities/rate";
import { User, UserModel } from "../entities/user";
import { RecipeInput } from "./types/recipe-input";
import { RateInput } from "./types/rate-input";
import { Context } from "../index";
import { ObjectIdScalar } from "@common/object-id.scalar";

@Resolver(() => Recipe)
export class RecipeResolver {
  @Query(() => Recipe, { nullable: true })
  async recipe(@Arg("recipeId", () => ObjectIdScalar) recipeId: ObjectId) {
    
    return RecipeModel.findById(recipeId);
  }

  @Query(() => [Recipe])
  async recipes(): Promise<Recipe[]> {
    
    return RecipeModel.find({});  
  }

  @Mutation(() => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    @Ctx() { user }: Context,
  ): Promise<Recipe> {
    
    const recipe = new RecipeModel({
      ...recipeInput,
      author: user._id,
    } as Recipe);

    return await recipe.save();
  }

  @Mutation(() => Recipe)
  async rate(@Arg("rate") rateInput: RateInput, @Ctx() { user }: Context): Promise<Recipe> {
    // find the recipe
    
    const recipe = await RecipeModel.findById(rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // set the new recipe rate
    const newRate: Rate = {
      value: rateInput.value,
      user: user._id,
      date: new Date(),
    };

    // update the recipe
    (recipe.ratings as Rate[]).push(newRate);
    await recipe.save();
    return recipe;
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User> {
    return (await UserModel.findById(recipe.author))!;
  }
}
