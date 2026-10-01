import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import type { CreateUserOutput } from '../../application/dto/create-user.dto.js';
import { CreateUser } from '../../application/use-cases/create-user.js';
import { validateCreateUserBody } from '../validators/create-user.validator.js';

@Controller('users')
export class UsersController {
  constructor(@Inject(CreateUser) private readonly createUser: CreateUser) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: unknown): Promise<CreateUserOutput> {
    const validation = validateCreateUserBody(body);
    if (!validation.ok) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos.',
        errors: validation.errors,
      });
    }

    return this.createUser.execute(validation.value);
  }
}
