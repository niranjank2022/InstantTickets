import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { messages } from '../config/logger';

export function validateRequest<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(instance);

    if (errors.length > 0) {
      res.status(400).json({
        message: messages.VALIDATION_ERROR,
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return;
    }

    next();
  };
}
