import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value)
    } catch (error) {
      throw new BadRequestException(fromZodError(error).message)
    }
    return value
  }
}
