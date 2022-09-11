import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Post } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { ApolloContextType } from '../types';
import { appDataSource } from '../appDataSource';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver()
export class PostResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => String) postId: string,
    @Arg('value', () => Int) value: number,
    @Ctx() ctx: ApolloContextType,
  ) {
    const post = await Post.findOneBy({ id: postId });

    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;

    if (!post) {
      return false;
    }

    try {
      await appDataSource.transaction(async (em) => {
        await em.insert(Upvote, {
          postId,
          userId: ctx.req.session.userId,
          value: realValue,
        });

        await em.update(
          Post,
          {
            id: postId,
          },
          { points: post.points + realValue },
        );
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  //TODO: Try offset base pagination
  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit') limit: number,
    @Arg('cursor', () => String, { nullable: true })
    cursor: string | null,
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = appDataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .innerJoinAndSelect(
        'post.creator',
        'user',
        'user.id = post.creatorId',
      )
      .orderBy('post.createdAt', 'DESC')
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where('post.createdAt < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: string): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() ctx: ApolloContextType,
  ): Promise<Post> {
    const post = Post.create({
      creatorId: ctx.req.session.userId,
      ...input,
    });

    return Post.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('title', () => String, { nullable: true }) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });

    if (!post) {
      return null;
    }

    if (typeof title !== undefined) {
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() ctx: ApolloContextType,
  ): Promise<boolean> {
    // Safely deleting only current user posts
    await Post.delete({ id, creatorId: ctx.req.session.userId });
    return true;
  }
}
