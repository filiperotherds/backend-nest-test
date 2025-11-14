import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Param,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  InviteMemberBodySchema,
  inviteMemberBodySchema,
} from '../dtos/invite-member.dto'
import { InviteMemberUseCase } from '@/domain/organization/application/use-cases/invite-member.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

@Controller('/organizations/:organizationId/invites')
@UseGuards(JwtAuthGuard)
export class InviteMemberController {
  constructor(private inviteMember: InviteMemberUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(inviteMemberBodySchema))
  async handle(
    @Body() body: InviteMemberBodySchema,
    @Param('organizationId') organizationId: string,
  ) {
    const { recipientEmail, role } = body

    const result = await this.inviteMember.execute({
      organizationId,
      recipientEmail,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new Error(error.message)
      }
    }
  }
}
