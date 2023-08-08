import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { encryptPassword } from './common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>){}

    async create(createUserInput: CreateUserInput): Promise<User> {

      //generate new unique username
      const { firstName, lastName, password } = createUserInput
      let registredUser = undefined
      let count = 0
      let username = ''
      do {
        username = firstName.toLowerCase().replace(/\s/g, '') + lastName.toLowerCase().replace(/\s/g, '') + (count > 0 ? count : '');
        registredUser = await this.userRepository.findOne({ where: { username } })
        count++
      }while(registredUser)
      
      const hash = await encryptPassword(password)

      return this.userRepository.save({...createUserInput, username, password: hash });
    }

    findAll(): Promise<User[]> {
      return this.userRepository.find();
    }

    findOne(username: string) {
      return this.userRepository.findOne({ where: { username } })
    }

    async update(ctx: any,id: number, updateUserInput: UpdateUserInput) {
      try {
        const { userId, username } = ctx.req.user //get user from context

        if(userId !== id) throw Error('User invalid') //if the user logged in is different from the passed user

        const user = await this.userRepository.findOne({ where: { id } })
        if(!user) throw Error('User not found')

        //check if password is not null, encrypt it
        const password = updateUserInput.password ? await encryptPassword(updateUserInput.password) : user.password

        const updated = await this.userRepository.update({ id }, { ...updateUserInput, password })
        return !!updated

      } catch (error) {
        console.log(error)
        return error
      }
    }

    async remove(id: number) {
      const deleted = await this.userRepository.delete(id)
      return !!deleted
    }
}
