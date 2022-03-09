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

  /**
   * Gets an element from sparray by index.
   * Negative indices will get elements backward.
   * Out of bound indices will return undefined.
   *
   * @param index - the position of the element that should be gotten
   */
  get(index: number): T {
    const resolvedIndex = this.resolveIndex(index)
    return this.data[resolvedIndex]
  }

  /**
  * Returns a key iterator of the sparray.
  */
  keys(): IterableIterator<number> {
    return this.data.keys()
  }

  /**
   * Returns a value iterator of the sparray.
   */
  values(): IterableIterator<T> {
    return this.data.values()
  }

  /**
   * Returns an entry iterator of the sparray.
   * Each element is a two-position array, the index, and the value.
   */
  entries(): IterableIterator<[number, T]> {
    return this.data.entries()
  }

  [Symbol.iterator]() {
    return this.values()
  }

  /**
  * The number of elements of the sparray.
  * @see size()
  * @see count()
  */
  get length(): number {
    return this.data.length
  }

  /**
   * Returns the number of elements of the sparray.
   * Same result of length.
   * @see length
   * @see count()
   */
  size(): number {
    return this.length
  }

  /**
   * Counts the number of elements.
   * If a conditionFn is provided, only the elements that match the condition will be counted.
   *
   * @param conditionFn - an optional condition function
   */
  count(conditionFn?: (element: T, index: number, sparray: Sparray<T>) => boolean): number {
    if (!conditionFn)
      return this.length

    let countMatches = 0
    for (let i = 0; i < this.length; i++) {
      if (conditionFn(this.data[i], i, this))
        countMatches++
    }

    return countMatches
  }

  /**
   * Build a new sparray by transforming the elements according to the mapFn function.
   * For each element in sparray, mapFn must return a new element (derived or not from the original one).
   * @param mapFn - transformation function
   */
  map<R>(mapFn: (element: T, index: number, sparray: Sparray<T>) => R): Sparray<R> {
    const mappedData = this.data.map((element, index) => mapFn(element, index, this))
    return from(mappedData)
  }

  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   */
  reduce(reduceFn: (previousValue: T, currentValue: T, currentIndex: number, sparray: Sparray<T>) => T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduce(reduceFn: (previousValue: T, currentValue: T, currentIndex: number, sparray: Sparray<T>) => T, initialValue: T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduce<R>(reduceFn: (previousValue: R, currentValue: T, currentIndex: number, sparray: Sparray<T>) => R, initialValue: R): R
  reduce(reduceFn: (previousValue: any, currentValue: T, currentIndex: number, sparray: Sparray<T>) => any, initialValue?: any): any {
    if (typeof initialValue === 'undefined')
      return this.data.reduce((previous, current, i) => reduceFn(previous, current, i, this))
    else
      return this.data.reduce((previous, current, i) => reduceFn(previous, current, i, this), initialValue)
  }

  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation from the last to the first element.
   * @param reduceFn - aggragation (reducer) function
   */
  reduceRight(reduceFn: (previousValue: T, currentValue: T, currentIndex: number, sparray: Sparray<T>) => T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation from the last to the first element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduceRight(reduceFn: (previousValue: T, currentValue: T, currentIndex: number, sparray: Sparray<T>) => T, initialValue: T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation from the last to the first element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduceRight<R>(reduceFn: (previousValue: R, currentValue: T, currentIndex: number, sparray: Sparray<T>) => R, initialValue: R): R
  reduceRight(reduceFn: (previousValue: any, currentValue: T, currentIndex: number, sparray: Sparray<T>) => any, initialValue?: any): any {
    if (typeof initialValue === 'undefined')
      return this.data.reduceRight((previous, current, i) => reduceFn(previous, current, i, this))
    else
      return this.data.reduceRight((previous, current, i) => reduceFn(previous, current, i, this), initialValue)
  }

}
