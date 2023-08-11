import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => String, { description: 'Título do post' })
  title: string;

  @Field(() => String, { description: 'Conteúdo do post' })
  description: string;

  @Field(() => Int)
  id: number; //id do post que está sendo editado

  @Field(() => Boolean)
  isFixed: boolean;
}
