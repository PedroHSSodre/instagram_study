import { Catch, HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import {
  InvalidUserDataError,
  UserAlreadyExistsError,
} from '../../domain/errors/user-errors.js';

interface JsonResponse {
  status(code: number): { json(body: unknown): void };
}

@Catch(InvalidUserDataError, UserAlreadyExistsError)
export class UserErrorsFilter implements ExceptionFilter {
  catch(error: InvalidUserDataError | UserAlreadyExistsError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<JsonResponse>();
    const status =
      error instanceof UserAlreadyExistsError ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      code: error.code,
      message: error.message,
      errors: { [error.field]: error.message },
    });
  }
}
