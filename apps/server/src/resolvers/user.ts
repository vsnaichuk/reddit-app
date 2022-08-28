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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { v4 as uuid } from 'uuid';
import { sendEmail } from '../utils/sendEmail';

@InputType()
class UsernamePasswordInput {
  @Field()
  email: string;
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
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() ctx: ApolloContextType,
  ) {
    const user = await ctx.em.findOne(User, { email });
    if (!user) {
      // the email is not in db
      return true;
    }

    const token = uuid();

    await ctx.redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'EX',
      1000 * 60 * 60 * 24 * 3, // 3 days
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`,
    );

    return true;
  }

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
      id: uuid(),
      email: options.email,
      username: options.username,
      password: hashedPassword,
    });

    try {
      await ctx.em.persistAndFlush(user);
    } catch (err) {
      // 23505 - username already exist
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

    // Store user id session
    // this will set cookie and keep user logged in
    ctx.req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() ctx: ApolloContextType,
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(
      User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'That username doe not exist',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

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

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: ApolloContextType) {
    return new Promise((res) =>
      ctx.req.session.destroy((err) => {
        ctx.res.clearCookie(COOKIE_NAME, {
          sameSite: 'none',
          secure: true,
        });

        if (err) {
          console.log(err);
          res(false);
          return;
        }

        res(true);
      }),
    );
  }
}
