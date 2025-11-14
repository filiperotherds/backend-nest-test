export interface TokenPayload {
  sub: string
  role: 'client' | 'professional'
}

export abstract class TokenManager {
  abstract sign(payload: TokenPayload): Promise<string>
  abstract verify(token: string): Promise<TokenPayload | null>
}
