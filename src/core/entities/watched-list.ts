export abstract class WatchedList<T> {
  public currentItems: T[]
  private initialItems: T[]
  private _newItems: T[]
  private _removedItems: T[]

  protected constructor(initialItems: T[]) {
    this.currentItems = initialItems ?? []
    this.initialItems = initialItems ?? []
    this._newItems = []
    this._removedItems = []
  }

  abstract compareItems(a: T, b: T): boolean

  getNewItems(): T[] {
    return this._newItems
  }

  getRemovedItems(): T[] {
    return this._removedItems
  }

  get items() {
    return this.currentItems
  }

  get length() {
    return this.currentItems.length
  }

  private is = {
    new: (item: T): boolean => {
      return !this.initialItems.some((initialItem) =>
        this.compareItems(initialItem, item),
      )
    },
    removed: (item: T): boolean => {
      return !this.currentItems.some((currentItem) =>
        this.compareItems(currentItem, item),
      )
    },
  }

  private updateLists() {
    this._newItems = this.currentItems.filter(this.is.new)
    this._removedItems = this.initialItems.filter(this.is.removed)
  }

  public update(items: T[]) {
    this.currentItems = items
    this.updateLists()
  }

  public add(item: T) {
    this.currentItems.push(item)
    this.updateLists()
  }

  public remove(item: T) {
    this.currentItems = this.currentItems.filter(
      (currentItem) => !this.compareItems(currentItem, item),
    )
    this.updateLists()
  }

  public get(index: number) {
    return this.currentItems[index]
  }

  public includes(item: T) {
    return this.currentItems.some((currentItem) =>
      this.compareItems(currentItem, item),
    )
  }

  public toArray() {
    return this.currentItems
  }

  public static create<T>(items: T[]) {
    return new (class extends WatchedList<T> {
      compareItems(a: T, b: T): boolean {
        return a === b
      }
    })(items)
  }
}
