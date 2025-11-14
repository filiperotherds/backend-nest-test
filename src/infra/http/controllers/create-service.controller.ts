import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  CreateServiceBodySchema,
  createServiceBodySchema,
} from '../dtos/create-service.dto'
import { CreateServiceUseCase } from '@/domain/services/application/use-cases/create-service.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/organizations/:organizationId/services')
@UseGuards(JwtAuthGuard)
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createServiceBodySchema))
  async handle(
    @Body() body: CreateServiceBodySchema,
    @Param('organizationId') organizationId: string,
  ) {
    const { categoryId, title, description, priceType, basePrice } = body

    await this.createService.execute({
      organizationId,
      categoryId,
      title,
      description,
      priceType,
      basePrice,
    })
  }
}
