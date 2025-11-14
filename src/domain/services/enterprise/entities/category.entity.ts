import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from '@/domain/organization/enterprise/value-objects/slug.vo'

export interface CategoryProps {
  name: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.props.slug = Slug.createFromText(name)
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CategoryProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return category
  }
}
