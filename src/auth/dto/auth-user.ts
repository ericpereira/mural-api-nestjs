import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@InputType()
export class AuthUserInput {
  @Field(() => String, { description: 'Username of the user' })
  username: string;

  @Field(() => String, { description: 'Valid password' })
  password: string;
}

@ObjectType()
export class LogInResponse {
    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}