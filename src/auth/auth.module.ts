import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions:{
        //expiresIn: '60s'
      }
      ,
    }),
    PassportModule
  ],
  providers: [
    AuthService,
    UsersService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule {}
