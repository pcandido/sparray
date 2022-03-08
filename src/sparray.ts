import util from 'util'

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
 * Build a sparray with numbers from 0 (inclusive) to end (exclusive)
 * @param end
 */
export function range(end: number): Sparray<number>

/**
 * Build a sparray with numbers from start (inclusive) to end (exclusive)
 * @param end
 */
export function range(start: number, end: number): Sparray<number>

/**
 * Build a sparray with numbers from start (inclusive) to end (exclusive), incrementing/decrementing by step value
 * @param end
 */
export function range(start: number, end: number, step: number): Sparray<number>
export function range(start: number, end?: number, step?: number): Sparray<number> {

  if (typeof end === 'undefined') {
    end = start
    start = 0
  }

  if (typeof step === 'undefined') {
    step = (start < end) ? 1 : -1
  }

  if ((start < end && step < 0) || (start > end && step > 0) || (step == 0)) {
    throw new Error(`Invalid step value: ${step}`)
  }

  const data: number[] = []
  if (start < end) {
    for (let i = start; i < end; i += step) data.push(i)
  } else {
    for (let i = start; i > end; i += step) data.push(i)
  }

  return new Sparray<number>(data)
}

/**
 * Build a sparray by repeating value for n times
 * @param value the value will fill the sparray
 * @param times quantity of values to fill sparray
 * @deprecated Use #repeat(value, times)
 */
export function fillOf<T>(times: number, value: T): Sparray<T> {
  return repeat(value, times)
}

/**
 * Build a sparray by repeating value for n times
 * @param value the value will fill the sparray
 * @param times quantity of values to fill sparray
 */
export function repeat<T>(value: T, times: number): Sparray<T> {
  if (times < 0) throw new Error(`Invalid "times" value: ${times}`)

  const data = new Array(times).fill(value)
  return new Sparray(data)
}

/**
 * Build an empty sparray
 */
export function empty<T>(): Sparray<T> {
  return new Sparray<T>([])
}

/**
 * Determines if an object is an instance of sparray
 * @param object - object to verify
 */
export function isSparray(object: any) {
  return object instanceof Sparray
}

/**
 * Sparray - Supper Array
 * Holds the methods and attributes of a sparray. Sparrays are immutable, i.e. it is not possible to include,
 * remove or replace an element of a sparray (although it is possible to change the referenced element,
 * e.g: attributes of an embeded object). Every operation/transformation (such as map, filter, and concat)
 * will generate a new and immutable sparray.
 */
export class Sparray<T>{

  private data: T[]

  /**
   * Constructor of the sparray
   *
   * @constructor
   * @param data - array with the elements
   */
  constructor(data: T[]) {
    if (!Array.isArray(data))
      throw new Error('Invalid data value')

    this.data = [...data]
  }

  [util.inspect.custom](depth: any, opts: any): any {
    return this.data
  }

  /**
   * Returns the raw data as a native array
   */
  toArray(): T[] {
    return [...this.data]
  }

  /**
   * Returns the raw data as a native Set
   */
  toSet(): Set<T> {
    return new Set(this.data)
  }

  private resolveIndex(index: number): number {
    if (index < 0)
      return this.data.length + index

    return index
  }

  get(index: number): T {
    const resolvedIndex = this.resolveIndex(index)
    return this.data[resolvedIndex]
  }

}
