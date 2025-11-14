import { CategoriesRepository } from '@/domain/services/application/repositories/categories-repository'
import { Category } from '@/domain/services/enterprise/entities/category.entity'
import { PrismaService } from '../prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/organization/enterprise/value-objects/slug.vo'

export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!category) {
      return null
    }

    return Category.create(
      {
        name: category.name,
        slug: Slug.create(category.slug),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      new UniqueEntityID(category.id),
    )
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
    })

    if (!category) {
      return null
    }

    return Category.create(
      {
        name: category.name,
        slug: Slug.create(category.slug),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      new UniqueEntityID(category.id),
    )
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany()

    return categories.map((category) =>
      Category.create(
        {
          name: category.name,
          slug: Slug.create(category.slug),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
        new UniqueEntityID(category.id),
      ),
    )
  }

  async create(category: Category): Promise<void> {
    await this.prisma.category.create({
      data: {
        id: category.id.toString(),
        name: category.name,
        slug: category.slug.value,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt ?? category.createdAt,
      },
    })
  }

  async save(category: Category): Promise<void> {
    await this.prisma.category.update({
      where: {
        id: category.id.toString(),
      },
      data: {
        name: category.name,
        slug: category.slug.value,
        updatedAt: new Date(),
      },
    })
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id: category.id.toString(),
      },
    })
  }
}
