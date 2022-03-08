/**
 * Builds a sparray from several ways:
 * 1) with no param for an empty array (same of #empty())
 * 2) with a single non-array-like element for an sparray of one element
 * 3) with a single array-like element for a copy of this array
 * 4) with a single sparray object for a copy of this sparray
 * 5) with multiple params for a multi-element array
 *
 * @param data - elements to build a sparray
 */
export function from<T>(): Sparray<T>
export function from<T>(item: T[]): Sparray<T>
export function from<T>(item: Set<T>): Sparray<T>
export function from<T>(item: T): Sparray<T>
export function from<T>(...items: T[]): Sparray<T>
export function from<T>(...data: any): Sparray<T> {
  if (data.length == 0) {
    return new Sparray([])
  } else if (data.length === 1) {
    const singleValue = data[0]

    if (isSparray(singleValue)) {
      return new Sparray(singleValue.data)
    } else if (singleValue instanceof Set) {
      return new Sparray(Array.from(singleValue))
    } else if (Array.isArray(singleValue)) {
      return new Sparray(singleValue)
    } else {
      return new Sparray([singleValue])
    }
  } else {
    return new Sparray(data)
  }
}

/**
 * Determines if an object is an instance of sparray
 * @param obj - object to verify
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
