import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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

    //encrypt password
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return this.userRepository.save({...createUserInput, username, password: hash });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
