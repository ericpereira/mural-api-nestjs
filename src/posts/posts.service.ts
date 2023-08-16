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
                userId,
                referredUserId: referredUser ? referredUser.id : null
            })
            
        } catch (error) {
            console.log(error)
            return error
        }
    }
    
    async update(ctx: any, updatePostInput: UpdatePostInput){
        try {
            const { userId } = ctx.req.user

            //caso queira fixar esse post, verifica se já não há 3 posts fixados
            //pega a quantidade de posts fixados
            const countFixedPosts = updatePostInput.isFixed ? await this.postRepository.count({
                where: {
                    userId,
                    isFixed: true
                }
            }) : 0
            console.log('countFixedPosts', countFixedPosts)
            if(countFixedPosts >= 3) throw Error("Você já fixou 3 posts, remova um dos posts fixados para poder fixar este...")
            

            const post = await this.postRepository.findOne({
                where: {
                    id: updatePostInput.id,
                    userId
                }
            })

            if(!post) throw Error("Postagem não encontrada")

            const updated = await this.postRepository.update(updatePostInput.id, {
                ...updatePostInput
            })
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
                isFixed: true,                
            } : {
                userId: args.extUserId ? args.extUserId : userId,
            }

            return this.postRepository.find({
                where: [{
                    ...where,
                },
                { referredUserId: userId }, //OR usa esse OU para buscas os posts que o usuário foi referenciado
                ],
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

    // search(ctx: any, args: FindAllPostsArgs){
    //     try {
    //         const { userId } = ctx.req.user
    //         console.log({
    //             where: [
    //                 // args.extUserId && args.term ? { // 1 caso passou o id do usuário e veja se encontra o termo no title
    //                 //     title: `%${args.term}%`,
    //                 //     userId: args.extUserId
    //                 // } : null,
    //                 // args.extUserId && args.term ? { // 2 caso passou o id do usuário e veja se encontra o termo no description
    //                 //     description: `%${args.term}%`,
    //                 //     userId: args.extUserId
    //                 // } : null,
    //                 args.term ? { // 3 NÃO passou o id do usuário e veja se encontra o termo no title
    //                     title: `%${args.term}%`
    //                 } : null,
    //                 args.term ? { // 4 NÃO passou o id do usuário e veja se encontra o termo no description
    //                     description: `%${args.term}%`
    //                 } : null,
    //             ],
    //             order: {
    //                 createdAt: args?.oldestFirst ? 'ASC' : 'DESC'
    //             },
    //             // skip: args?.skip, //paginação
    //             // take: args?.take //paginação
    //         })
            
    //         return this.postRepository.find({
    //             where: [
    //                 // args.extUserId && args.term ? { // 1 caso passou o id do usuário e veja se encontra o termo no title
    //                 //     title: `%${args.term}%`,
    //                 //     userId: args.extUserId
    //                 // } : null,
    //                 // args.extUserId && args.term ? { // 2 caso passou o id do usuário e veja se encontra o termo no description
    //                 //     description: `%${args.term}%`,
    //                 //     userId: args.extUserId
    //                 // } : null,
    //                 // args.term ? { // 3 NÃO passou o id do usuário e veja se encontra o termo no title
    //                 //     title: `%${args.term}%`
    //                 // } : null,
    //                 args.term ? { // 4 NÃO passou o id do usuário e veja se encontra o termo no description
    //                     description: `%${args.term}%`
    //                 } : null,
    //             ],
    //             order: {
    //                 createdAt: args?.oldestFirst ? 'ASC' : 'DESC'
    //             },
    //             // skip: args?.skip, //paginação
    //             // take: args?.take //paginação
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         return error
    //     }
    // }

    async search(ctx: any, args: FindAllPostsArgs) {
        try {
          const { userId } = ctx.req.user;
      
          const queryBuilder = this.postRepository.createQueryBuilder('post');
      
        //   if (args.typeSearch === TypeSearch.user) {
        //     queryBuilder.andWhere('post.userId = :userId', { userId });
        //   }

            // JOIN com o usuário criador do post
            queryBuilder.leftJoinAndSelect('post.user', 'user');
            // JOIN com o usuário referenciado no post
            queryBuilder.leftJoinAndSelect('post.referredUser', 'referredUser');
      
          if (args.term) {
            queryBuilder.andWhere('(post.title LIKE :term OR post.description LIKE :term)', { term: `%${args.term}%` });
          }

          if (args.extUserId) {
            queryBuilder.andWhere('user.id = :userId', { userId: args.extUserId });
          }
      
        //   if (args.isFixed) {
        //     queryBuilder.andWhere('post.isFixed = :isFixed', { isFixed: true });
        //   }
      
          queryBuilder.orderBy('post.createdAt', args.oldestFirst ? 'ASC' : 'DESC');
          queryBuilder.skip(args.skip);
          queryBuilder.take(args.take);
      
          const posts = await queryBuilder.getMany();
          console.log('posts', posts)
          return posts;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      
}
