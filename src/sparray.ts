export function from<T>(): Sparray<T>
export function from<T>(item: T[]): Sparray<T>
export function from<T>(item: T): Sparray<T>
export function from<T>(...items: T[]): Sparray<T>
export function from<T>(...data: any): Sparray<T> {
  if (data.length == 0)
    return new Sparray([])

  if (data.length === 1) {
    const singleValue = data[0]

    if (Array.isArray(singleValue)) {
      return new Sparray(singleValue)
    } else {
      return new Sparray([singleValue])
    }
  }

  return new Sparray(data)
}

class Sparray<T>{

  private data: T[]

  constructor(data: T[]) {
    this.data = data
  }

}
