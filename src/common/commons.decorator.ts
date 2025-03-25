import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
      example: {
        message: 'Some field is missing or invalid',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      example: {
        message: 'Invalid credentials provided or token was not found',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
    }),
  );
}
