import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
//export class UpdateUserInput extends PartialType(CreateUserInput) {
export class UpdateUserInput {
  @Field(() => String, { description: 'First name', nullable: true})
  firstName: string;

  @Field(() => String, { description: 'Last name', nullable: true })
  lastName: string;

  @Field(() => String, { description: 'Valid email', nullable: true })
  email: string;

  @Field(() => String, { description: 'User password', nullable: true })
  password: string;

  @Field(() => Boolean, { description: 'Flag to set if user is active or not', nullable: true })
  isActive: boolean;

  @Field(() => Int)
  id: number;
}
