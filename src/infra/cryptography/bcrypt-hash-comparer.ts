import { HashComparer } from '@/domain/auth/application/cryptography/hash-comparer'
import { compare } from 'bcryptjs'

export class BcryptHashComparer implements HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
