import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput)
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard) //only visible for logged users
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.usersService.findOne(username);
  }

  
  @Mutation(() => Boolean, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Context() ctx,
    @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(ctx, updateUserInput.id, updateUserInput);
  }

  
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
