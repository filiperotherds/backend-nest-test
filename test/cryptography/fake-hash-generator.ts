import { HashGenerator } from '@/domain/auth/application/cryptography/hash-generator'

export class FakeHashGenerator implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`
  }
}
