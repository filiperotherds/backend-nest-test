import { ValueObject } from '@/core/entities/value-object'

export interface SlugProps {
  value: string
}

export class Slug extends ValueObject<SlugProps> {
  get value() {
    return this.props.value
  }

  /**
   * Recebe uma string e normaliza para um slug.
   * Exemplo: "Minha Organização de Serviços" -> "minha-organizacao-de-servicos"
   * @param text
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return new Slug({ value: slugText })
  }

  static create(value: string) {
    return new Slug({ value })
  }
}
