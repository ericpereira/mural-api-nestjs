import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => String, { description: 'Título do post', nullable: true })
  title: string;

  @Field(() => String, { description: 'Conteúdo do post', nullable: true })
  description: string;

  @Field(() => Int)
  id: number; //id do post que está sendo editado

  @Field(() => Boolean, { nullable: true })
  isFixed: boolean;
}
