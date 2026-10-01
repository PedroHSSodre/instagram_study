import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUser } from './application/use-cases/create-user.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from './domain/repositories/user-repository.js';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from './domain/services/password-hasher.js';
import { BcryptPasswordHasher } from './infrastructure/hashing/bcrypt-password-hasher.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user-repository.js';
import { UsersController } from './presentation/controllers/users.controller.js';
import { UserErrorsFilter } from './presentation/filters/user-errors.filter.js';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PASSWORD_HASHER,
      useFactory: () => new BcryptPasswordHasher(),
    },
    {
      provide: CreateUser,
      useFactory: (users: UserRepository, hasher: PasswordHasher) =>
        new CreateUser(users, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    { provide: APP_FILTER, useClass: UserErrorsFilter },
  ],
})
export class UsersModule {}
