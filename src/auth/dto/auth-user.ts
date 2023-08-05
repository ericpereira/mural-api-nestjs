import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class AuthUserInput {
  @Field(() => String, { description: 'Username of the user' })
  username: string;

  @Field(() => String, { description: 'Valid password' })
  pass: string;
}

@ObjectType()
export class SignInResponse {
    @Field()
    access_token: string;
}