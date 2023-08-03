import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
//import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        autoLoadEntities: true
    }),
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: 'schema.gql',
        // transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
        // installSubscriptionHandlers: true,
        // buildSchemaOptions: {
        //     directives: [
        //     new GraphQLDirective({
        //         name: 'upper',
        //         locations: [DirectiveLocation.FIELD_DEFINITION],
        //     }),
        //     ],
        // },
    }),
    AuthModule,
  ],
})
export class AppModule {}