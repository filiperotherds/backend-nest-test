import { Category } from '@/domain/services/enterprise/entities/category.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class CategoriesRepository {
  abstract findById(id: UniqueEntityID): Promise<Category | null>
  abstract findBySlug(slug: string): Promise<Category | null>
  abstract findAll(): Promise<Category[]>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
}
