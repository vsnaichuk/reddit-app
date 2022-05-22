import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';
import { ApolloContextType } from '../types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: ApolloContextType): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() ctx: ApolloContextType,
  ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() ctx: ApolloContextType,
  ): Promise<Post> {
    const post = ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() ctx: ApolloContextType,
  ): Promise<Post | null> {
    const post = await ctx.em.findOne(Post, { id });

    if (!post) {
      return null;
    }

    if (typeof title !== undefined) {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }

    return post;
  }
}
