import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { ApolloContextType } from '../types';
import { v4 as uuidv4 } from 'uuid';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ApolloContextType) {
    // you are not logged in
    if (!ctx.req.session.userId) {
      return null;
    }

    const user = await ctx.em.findOne(User, {
      id: ctx.req.session.userId,
    });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: ApolloContextType,
  ): Promise<UserResponse> {
    // TODO: Try to use validation libs
    if (options.username.length <= 5) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Length must be greater than 5',
          },
        ],
      };
    }
    if (options.password.length <= 7) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Length must be greater than 7',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = ctx.em.create(User, {
      id: uuidv4(),
      username: options.username,
      password: hashedPassword,
    });

    try {
      await ctx.em.persistAndFlush(user);
    } catch (err) {
      // username already exist
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: ApolloContextType,
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, {
      username: options.username,
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'That username doe not exist',
          },
        ],
      };
    }

    const valid = await argon2.verify(
      user.password,
      options.password,
    );

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect password',
          },
        ],
      };
    }

    // Store user id session
    // this will set cookie and keep user logged in
    ctx.req.session.userId = user.id;

    return { user };
  }
}
