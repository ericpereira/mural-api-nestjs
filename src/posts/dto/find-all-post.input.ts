import { InputType, Int, Field, ArgsType, registerEnumType } from '@nestjs/graphql';

//TODO: remover
// enum TypeSearch {
//   all = 'all',
//   user = 'user'
// }

// registerEnumType(TypeSearch, { //precisa usar essa função pra criar um enum
//   name: 'TypeSearch',
// });

@InputType()
export class FindAllPostsArgs {
  @Field(() => String, { description: 'Termo buscado', nullable: true })
  term: string;

  @Field(() => Boolean, { description: 'Se os posts retornados são somente os posts fixos', nullable: true })
  isFixed: boolean;

  @Field(() => Boolean, { description: 'Se serão os posts mais velhos que serão retornados primeiro', nullable: true })
  oldestFirst: boolean;

  @Field(() => Int, { description: 'Pular tantos posts (usado na paginação)', defaultValue: 0 })
  skip: number;

  @Field(() => Int, { description: 'Pegar tantos posts (usado na paginação)', nullable: true })
  take: number;

  @Field(() => Int, { description: "Pegar as postagens de um usuário específico", nullable: true })
  extUserId: number
}
