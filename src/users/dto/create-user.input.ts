import { InputType, Int, Field, ArgsType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'First name' })
  firstName: string;

  @Field(() => String, { description: 'Last name' })
  lastName: string;

  @Field(() => String, { description: 'Valid email' })
  email: string;

  @Field(() => String, { description: 'User password' })
  password: string;
}
