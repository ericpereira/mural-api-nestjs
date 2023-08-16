import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@ObjectType()
@Entity()
export class Post {
    @Field(() => ID) //needed for code first generate schema
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    title: string;

    @Field(type => String)
    @Column({ type: 'text' })
    description: string;

    @Field(type => Boolean)
    @Column({ default: false })
    isFixed: boolean; //irá controlar se o post está ou não fixado na página do seu criador

    @Field(type => ID)
    @Column()
    userId: number //dono da postagem

    @Field(type => User)
    @ManyToOne(type => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Field(type => ID, { nullable: true })
    @Column({ nullable: true })
    referredUserId: number //usuário que recebeu a postagem em seu mural

    @Field(type => User, { nullable: true })
    @ManyToOne(type => User, { eager: true }) //pode ser nulo pq iremos usar a mesma entidade para posts normais, então esse dado pode não ser passado
    @JoinColumn({ name: 'referredUserId' })
    referredUser: User;

    @Field(type => Date)
    @CreateDateColumn({ name: 'created_at' }) // Define a coluna de data de criação
    createdAt: Date;

    @Field(type => Date)
    @UpdateDateColumn({ name: 'updated_at' }) // Define a coluna de data de atualização
    updatedAt: Date;
}
