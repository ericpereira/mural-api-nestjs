import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthUserInput, SignInResponse } from './dto/auth-user';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  @Mutation(() => SignInResponse)
  async signIn(@Args('authUserInput') authUserInput: AuthUserInput): Promise<SignInResponse> {
    return this.authService.signIn(authUserInput.username, authUserInput.pass)
  }
}
