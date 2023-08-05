import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) { //make user validation and check password
    try {
      const user = await this.usersService.findOne(username);
      const isMatch = await bcrypt.compare(password, user.password);

      if(isMatch) {
        const { password, ...result } = user
        return result
      }

      return null
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async login(user: User) { //just generate the jwt token
    try {
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: this.jwtService.sign(payload),
        user
      };
    } catch (error) {
      console.log(error)
      return error
    }
  }
}