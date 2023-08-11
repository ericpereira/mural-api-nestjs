import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Título do post', nullable: true })
  title: string;

  @Field(() => String, { description: 'Conteúdo do post' })
  description: string;

  @Field(() => Int, { description: 'Id do usuário que o post é referido', nullable: true })
  referredUserId: number;
}
