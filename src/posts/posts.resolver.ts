import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Post } from './entities/post.entity/post.entity';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { FindAllPostsArgs } from './dto/find-all-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  
  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard) //only visible for logged users
  createPost(
    @Context() ctx,
    @Args('createPostInput') createPostInput: CreatePostInput): Promise<Post> {
    return this.postsService.create(ctx, createPostInput)
  }

  @Query(() => [Post], { name: 'findAllPosts' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Context() ctx,
    @Args('findAllPostsArgs') findAllPostsArgs: FindAllPostsArgs) {
    return this.postsService.findAll(ctx, findAllPostsArgs);
  }

  @Mutation(() => Boolean, { name: 'updatePost' })
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Context() ctx,
    @Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(ctx, updatePostInput);
  }

  
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removePost(
    @Context() ctx,
    @Args('id', { type: () => Int }) id: number) {
    return this.postsService.delete(ctx, id);
  }
}
