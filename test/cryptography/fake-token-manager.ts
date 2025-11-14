import {
  TokenManager,
  TokenPayload,
} from '@/domain/auth/application/providers/token-manager'

export class FakeTokenManager implements TokenManager {
  async sign(payload: TokenPayload): Promise<string> {
    return `token-for-${payload.sub}`
  }

  async verify(token: string): Promise<TokenPayload | null> {
    if (token.startsWith('token-for-')) {
      const sub = token.replace('token-for-', '')
      return { sub, role: 'client' } as TokenPayload
    }
    return null
  }
}
