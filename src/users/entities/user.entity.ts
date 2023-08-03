import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID) //needed for code first generate schema
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => String)
  @Column()
  firstName: string;

  @Field(type => String)
  @Column()
  lastName: string;

  @Field(type => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(type => String)
  @Column({ unique: true })
  email: string;

  @Field(type => String)
  @Column()
  password: string;

  @Field(type => String)
  @Column({ nullable: true })
  username: string;
}