import {
  TokenManager,
  TokenPayload,
} from '@/domain/auth/application/providers/token-manager'
import { JwtService } from '@nestjs/jwt'

export class JwtTokenManager implements TokenManager {
  constructor(private jwtService: JwtService) {}

  async sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload)
  }

  async verify(token: string): Promise<TokenPayload | null> {
    try {
      return this.jwtService.verify(token)
    } catch {
      return null
    }
  }
}
