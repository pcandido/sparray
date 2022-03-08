/**
 * Build an empty sparray. Same of #empty()
 */
export function from<T>(): Sparray<T>

/**
 * Build a sparray from another array
 * @param data array of elements
 */
export function from<T>(data: T[]): Sparray<T>

/**
 * Build a sparray from a set of elements
 * @param data set of elements
 */
export function from<T>(data: Set<T>): Sparray<T>

/**
 * Build a sparray from the colection of the arguments
 * @param data collection of elements
 */
export function from<T>(...data: T[]): Sparray<T>
export function from<T>(...data: any): Sparray<T> {
  if (data.length == 0)
    return new Sparray([])

  if (data.length === 1) {
    const singleValue = data[0]

    if (isSparray(singleValue))
      return new Sparray(singleValue.data)

    if (singleValue instanceof Set)
      return new Sparray(Array.from(singleValue))

    if (Array.isArray(singleValue))
      return new Sparray(singleValue)

    return new Sparray([singleValue])
  }

  return new Sparray(data)
}

/**
 * Determines if an object is an instance of sparray
 * @param object - object to verify
 */
export function isSparray(object: any) {
  return object instanceof Sparray
}

export class Sparray<T>{

  private data: T[]

  constructor(data: T[]) {
    this.data = data
  }

}
