import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { ApolloContextType } from '../types';

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

    // TODO: fix types
    ctx.req!.session!.userId = user.id;

    return {
      user,
    };
  }
}
