import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  RequestQuotationBodySchema,
  requestQuotationBodySchema,
} from '../dtos/request-quotation.dto'
import { RequestQuotationUseCase } from '@/domain/quotation/application/use-cases/request-quotation.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/quotations')
@UseGuards(JwtAuthGuard)
export class RequestQuotationController {
  constructor(private requestQuotation: RequestQuotationUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(requestQuotationBodySchema))
  async handle(@Body() body: RequestQuotationBodySchema, @Req() req: any) {
    const { organizationId, description } = body
    const clientId = req.user.sub // Assumindo que o userId é o clientId

    await this.requestQuotation.execute({
      clientId,
      organizationId,
      description,
    })
  }
}
