import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { User } from '../users/entities/user.entity';
import { UpdatePostInput } from './dto/update-post.input';
import { FindAllPostsArgs } from './dto/find-all-post.input';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        ){}

    async checkIfReferredUser(referredUserId: number){
        //se o usuário referido foi passado, vamos verificar se ele é um usuário válido, caso contrário da erro
        if(referredUserId){
            const referredUser = await this.userRepository.findOne({ where: { id: referredUserId } })
            if(!referredUser) throw Error('Usuário não encontrado')
            return referredUser
        }
        return null
    }

    async create(ctx: any, createPostInput: CreatePostInput){
        try {
            const { userId, username } = ctx.req.user //pega o usuário logado do contexto

            const referredUser = await this.checkIfReferredUser(createPostInput.referredUserId)
            
            return this.postRepository.save({
                title: createPostInput?.title,
                description: createPostInput.description,
                userId
            })
            
        } catch (error) {
            console.log(error)
            return error
        }
    }
    
    async update(ctx: any, updatePostInput: UpdatePostInput){
        try {
            const { userId } = ctx.req.user

            const post = await this.postRepository.findOne({
                where: {
                    id: updatePostInput.id,
                    userId
                }
            })

            if(!post) throw Error("Postagem não encontrada")

            const updated = await this.postRepository.update(updatePostInput.id, { ...updatePostInput })
            return !!updated //transforma esse cara em booleano, caso de certo é true, caso contrário é false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async delete(ctx: any, id: number){
        try {
            const { userId } = ctx.req.user

            const post = await this.postRepository.findOne({
                where: {
                    id,
                    userId
                }
            })

            if(!post) throw Error("Postagem não encontrada")

            const deleted = await this.postRepository.delete(id)
            return !!deleted //transforma esse cara em booleano, caso de certo é true, caso contrário é false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    findAll(ctx: any, args: FindAllPostsArgs){
        try {
            const { userId } = ctx.req.user

            //caso passe a flag isFixed, retorna só os posts fixados, caso contrário retorna todos
            const where = args?.isFixed ? {
                userId: args.extUserId ? args.extUserId : userId, //caso tenha passado esse argumento, pega as postagens de um usuário específico
                isFixed: true
            } : {
                userId: args.extUserId ? args.extUserId : userId,
            }

            return this.postRepository.find({
                where: {
                    ...where
                },
                order: {
                    createdAt: args?.oldestFirst ? 'ASC' : 'DESC'
                },
                skip: args?.skip, //paginação
                take: args?.take //paginação
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
