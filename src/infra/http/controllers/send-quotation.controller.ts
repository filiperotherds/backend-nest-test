import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  SendQuotationBodySchema,
  sendQuotationBodySchema,
} from '../dtos/send-quotation.dto'
import { SendQuotationUseCase } from '@/domain/quotation/application/use-cases/send-quotation.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@Controller('/quotations/:quotationId/send')
@UseGuards(JwtAuthGuard)
export class SendQuotationController {
  constructor(private sendQuotation: SendQuotationUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(sendQuotationBodySchema))
  async handle(
    @Body() body: SendQuotationBodySchema,
    @Param('quotationId') quotationId: string,
  ) {
    const { totalPrice, expiresAt, items } = body

    const result = await this.sendQuotation.execute({
      quotationId,
      totalPrice,
      expiresAt: new Date(expiresAt),
      items,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new Error(error.message)
      }
    }
  }
}
