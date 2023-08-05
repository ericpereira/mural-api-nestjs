import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUserInput, LogInResponse } from './dto/auth-user';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './passport/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  
  @Mutation(() => LogInResponse)
  @UseGuards(GqlAuthGuard) //middleware
  login(
    @Context() ctx,
    @Args('authUserInput') authUserInput: AuthUserInput): Promise<LogInResponse> {
    return this.authService.login(ctx.user)
  }
}
