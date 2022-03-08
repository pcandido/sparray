export function from<T>(): Sparray<T>{
  return new Sparray([])
}

class Sparray<T>{

  private data: T[]

  constructor(data: T[]) {
    this.data = data
  }

}
