import util from 'util'

type SparrayOrArray<T> = Sparray<T> | T[]
type Optional<T> = T | undefined

function fromArray(data: number[]): NumericSparray
function fromArray<T>(data: T[]): Sparray<T>
function fromArray<T>(data: T[]): Sparray<T> | NumericSparray {
  if (data.every(element => typeof element === 'number'))
    return new NumericSparray((data as unknown) as number[])

  return new Sparray(data)
}

/**
 * Build an empty sparray. Same of #empty()
 */
export function from<T>(): Sparray<T>
/**
 * Build a numericSparray from another numeric array
 * @param data array of numbers
 */
export function from(data: number[]): NumericSparray
/**
 * Build a sparray from another array
 * @param data array of elements
 */
export function from<T>(data: T[]): Sparray<T>
/**
 * Build a numericSparray from a set of numbers
 * @param data set of numbers
 */
export function from(data: Set<number>): NumericSparray
/**
 * Build a sparray from a set of elements
 * @param data set of elements
 */
export function from<T>(data: Set<T>): Sparray<T>
/**
* Build a numericSparray from another numericSparray
* @param data numeric sparray
*/
export function from(data: NumericSparray): NumericSparray
/**
 * Build a sparray from another sparray
 * @param data sparray
 */
export function from<T>(data: Sparray<T>): Sparray<T>
/**
 * Build a numericSparray from the colection of numeric arguments
 * @param data collection of numbers
 */
export function from(...data: number[]): NumericSparray
/**
 * Build a sparray from the colection of arguments
 * @param data collection of elements
 */
export function from<T>(...data: T[]): Sparray<T>
export function from<T>(...data: any): Sparray<T> {
  if (data.length == 0)
    return fromArray<T>([])

  if (data.length === 1) {
    const singleValue = data[0]

    if (isSparray(singleValue))
      return fromArray((singleValue as Sparray<T>).toArray())

    if (singleValue instanceof Set)
      return fromArray(Array.from(singleValue))

    if (Array.isArray(singleValue))
      return fromArray(singleValue)

    return fromArray([singleValue])
  }

  return fromArray<T>(data)
}

/**
 * Build a sparray with numbers from 0 (inclusive) to end (exclusive)
 * @param end
 */
export function range(end: number): NumericSparray
/**
 * Build a sparray with numbers from start (inclusive) to end (exclusive)
 * @param end
 */
export function range(start: number, end: number): NumericSparray
/**
 * Build a sparray with numbers from start (inclusive) to end (exclusive), incrementing/decrementing by step value
 * @param end
 */
export function range(start: number, end: number, step: number): NumericSparray
export function range(start: number, end?: number, step?: number): NumericSparray {

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

  return fromArray(data)
}

/**
 * Build a NumericSparray by repeating value for n times
 * @param value the value will fill the sparray
 * @param times quantity of values to fill sparray
 */
export function repeat(value: number, times: number): NumericSparray
/**
 * Build a sparray by repeating value for n times
 * @param value the value will fill the sparray
 * @param times quantity of values to fill sparray
 */
export function repeat<T>(value: T, times: number): Sparray<T>
export function repeat<T>(value: T, times: number): Sparray<T> {
  if (times < 0) throw new Error(`Invalid "times" value: ${times}`)

  const data = new Array(times).fill(value)
  return fromArray(data)
}

/**
 * Build an empty sparray
 */
export function empty<T>(): Sparray<T> {
  return fromArray<T>([])
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

  private _data: T[]

  protected get data() {
    return this._data
  }

  /**
   * Constructor of the sparray
   *
   * @constructor
   * @param data - array with the elements
   */
  constructor(data: T[]) {
    if (!Array.isArray(data))
      throw new Error('Invalid data value')

    this._data = [...data]
  }

  [util.inspect.custom](): T[] {
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

  /**
   * Gets an element from sparray by index.
   * Negative indices will get elements backward.
   * Out of bound indices will return undefined.
   *
   * @param index - the position of the element that should be gotten
   */
  at(index: number): T | undefined {
    return this.data.at(index)
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

  *[Symbol.iterator]() {
    for (const element of this.data) {
      yield element
    }
  }

  /**
   * Maps each element to an object containing the index and the value
   */
  enumerate(): Sparray<{ index: number, value: T }> {
    return fromArray(this.data.map((value, index) => ({ index, value })))
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
   * Returns true if the sparray is empty and false otherwise
   */
  isEmpty(): boolean {
    return this.length === 0
  }

  /**
   * Returns false if the sparray is empty and true otherwise
   */
  isNotEmpty(): boolean {
    return this.length > 0
  }

  /**
   * Build a new NumericSparray by transforming the elements according to the mapFn function.
   * For each element in sparray, mapFn must return a new element (derived or not from the original one).
   * @param mapFn - transformation function
   */
  map(mapFn: (element: T, index: number, sparray: Sparray<T>) => number): NumericSparray
  /**
   * Build a new sparray by transforming the elements according to the mapFn function.
   * For each element in sparray, mapFn must return a new element (derived or not from the original one).
   * @param mapFn - transformation function
   */
  map<R>(mapFn: (element: T, index: number, sparray: Sparray<T>) => R): Sparray<R>
  map<R>(mapFn: (element: T, index: number, sparray: Sparray<T>) => R): Sparray<R> | NumericSparray {
    const mappedData = this.data.map((element, index) => mapFn(element, index, this))
    return fromArray(mappedData)
  }

  /*
   * Build a new sparray by transforming the elements according to the mapFn function and flatten the resultant sparrays.
   * @param mapFn - transformation function
   */
  flatMap<R>(mapFn: (element: T, index: number, sparray: Sparray<T>) => Sparray<R>): Sparray<R>
  /*
   * Build a new sparray by transforming the elements according to the mapFn function and flatten the resultant sparrays.
   * @param mapFn - transformation function
   */
  flatMap(mapFn: (element: T, index: number, sparray: Sparray<T>) => NumericSparray): NumericSparray
  /**
   * Build a new NumericSparray by transforming the elements according to the mapFn function and flatten the resultant arrays.
   * @param mapFn - transformation function
   */
  flatMap(mapFn: (element: T, index: number, sparray: Sparray<T>) => number[]): NumericSparray
  /**
   * Build a new sparray by transforming the elements according to the mapFn function and flatten the resultant arrays.
   * @param mapFn - transformation function
   */
  flatMap<R>(mapFn: (element: T, index: number, sparray: Sparray<T>) => R[]): Sparray<R>
  flatMap(mapFn: (element: T, index: number, sparray: Sparray<T>) => any): any {
    const mappedData = this.data
      .flatMap((element, index) => {
        const mapped = mapFn(element, index, this)
        if (mapped instanceof Sparray)
          return mapped.toArray()
        else
          return mapped
      })
    return fromArray(mappedData)
  }

  /**
   * Builds a new sparray flatting the nested sparrays and/or arrays to the main sparray
   * @param depth - how deep the flat will be applied
   */
  flat(depth = 1): Sparray<any> {
    if (depth <= 0) return this

    const flattedArray = this.data.reduce((a: any[], b) => {
      if (b instanceof Sparray) {
        return a.concat(b.toArray())
      }
      return a.concat(b)
    }, [])

    const flattedSparray = fromArray(flattedArray)
    return flattedSparray.flat(depth - 1)
  }

  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   */
  reduce(reduceFn: (previousElement: T, currentElement: T, currentIndex: number, sparray: Sparray<T>) => T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduce(reduceFn: (previousElement: T, currentElement: T, currentIndex: number, sparray: Sparray<T>) => T, initialValue: T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation until the last element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduce<R>(reduceFn: (previousElement: R, currentElement: T, currentIndex: number, sparray: Sparray<T>) => R, initialValue: R): R
  reduce(reduceFn: (previousElement: any, currentElement: T, currentIndex: number, sparray: Sparray<T>) => any, initialValue?: any): any {
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
  reduceRight(reduceFn: (previousElement: T, currentElement: T, currentIndex: number, sparray: Sparray<T>) => T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation from the last to the first element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduceRight(reduceFn: (previousElement: T, currentElement: T, currentIndex: number, sparray: Sparray<T>) => T, initialValue: T): T
  /**
   * Aggregate the elements of sparray, pair-by-pair, according to the reduceFn,
   * accumulating the aggregation from the last to the first element.
   * @param reduceFn - aggragation (reducer) function
   * @param initialValue - initial value to the reduce chain
   */
  reduceRight<R>(reduceFn: (previousElement: R, currentElement: T, currentIndex: number, sparray: Sparray<T>) => R, initialValue: R): R
  reduceRight(reduceFn: (previousElement: any, currentElement: T, currentIndex: number, sparray: Sparray<T>) => any, initialValue?: any): any {
    if (typeof initialValue === 'undefined')
      return this.data.reduceRight((previous, current, i) => reduceFn(previous, current, i, this))
    else
      return this.data.reduceRight((previous, current, i) => reduceFn(previous, current, i, this), initialValue)
  }

  /**
   * Builds a new sparray with only the elements selected by the filterFn.
   * @param filterFn - filter function
   */
  filter(filterFn: (element: T, index: number, sparray: Sparray<T>) => boolean): Sparray<T> {
    const filtered = this.data.filter((element, index) => filterFn(element, index, this))
    return fromArray(filtered)
  }

  /**
   * Iterates over each element of the sparray.
   * The own (unchanged) sparray is returned at the end, thus other methods can be chained.
   * @param forEachFn - function to be executed over each element
   * @param thisArg - object to be used as this in forEachFn
   */
  forEach(forEachFn: (element: T, index: number, sparray: Sparray<T>) => void): Sparray<T> {
    this.data.filter((element, index) => forEachFn(element, index, this))
    return this
  }

  /**
   * Builds a new sparray of distinct values, removing all the duplicates
   */
  distinct(): Sparray<T> {
    return from(new Set(this.data))
  }

  /**
   * Join the elements of the sparray in a string using the separator and lastSeparator.
   * The comma is used as the default separator and last separator.
   * All the elements will be joined by using the separator, except for the last one, that will be joined with lastSeparator.
   * It allows you to join [1, 2, 3] in something like '1, 2, and 3'
   *
   * @param separator - separator for all the elements, except the last. Default = ","
   * @param lastSeparator - separator for the last element. Default = separator
   */
  join(separator = ',', lastSeparator = separator): string {
    const stringData = this.data.map(a => String(a ?? ''))

    if (stringData.length === 0) return ''
    if (stringData.length === 1) return stringData[0]

    const last = stringData.at(-1)
    const rest = stringData.slice(0, -1)
    const joinned = rest.join(separator) + lastSeparator + last

    return joinned
  }

  /**
   * Returns true if some element produces the result true in the someFn.
   * @param someFn - condiction to be tested
   */
  some(someFn: (element: T, index: number, sparray: Sparray<T>) => boolean): boolean {
    return this.data.some((element, index) => someFn(element, index, this))
  }

  /**
   * Returns true if every element produces the result true in the everyFn.
   * @param everyFn - condiction to be tested
   */
  every(everyFn: (element: T, index: number, sparray: Sparray<T>) => boolean): boolean {
    return this.data.every((element, index) => everyFn(element, index, this))
  }

  /**
   * Concatenates one or more sparrays, arrays or elements to the original sparray.
   * The result will be a new sparray. The original sparray will not be changed.
   *
   * @param data - sparrays, arrays or elements to concatenate
   */
  concat(...data: (T | T[] | Sparray<T>)[]): Sparray<T> {
    const unwrappedData = data.map(toConcat => {
      if (toConcat instanceof Sparray)
        return toConcat.toArray()
      return toConcat
    })
    return fromArray(this.data.concat(...unwrappedData))
  }

  /**
   * Returns the first element that satisfies the condition of findFn, or undefined if no element satisfies.
   * @param findFn - condiction to be tested
   */
  find(findFn: (element: T, index: number, sparray: Sparray<T>) => boolean): T | undefined {
    return this.data.find((element, index) => findFn(element, index, this))
  }

  /**
   * Returns the index of the first element that satisfies the condition of findFn, or -1 if no element satisfies.
   * @param findFn - condiction to be tested
   */
  findIndex(findFn: (element: T, index: number, sparray: Sparray<T>) => boolean): number {
    return this.data.findIndex((element, index) => findFn(element, index, this))
  }

  /**
   * Returns the first index of the given element, or -1 if not found
   * @param element value to search
   */
  indexOf(element: T): number {
    return this.data.indexOf(element)
  }

  /**
   * Returns the first index of the given element, or -1 if not found
   * @param element value to search
   */
  lastIndexOf(element: T): number {
    return this.data.lastIndexOf(element)
  }

  /**
   * Returns true if the sparray contains the value, and false otherwise
   * @param value value to search
   */
  includes(value: T): boolean {
    return this.data.includes(value)
  }

  /**
   * Returns true if the sparray contains all the given values, and false otherwise
   * @param value values to search
   */
  includesAll(...values: T[]): boolean {
    return values.every(element => this.data.includes(element))
  }

  /**
   * Returns true if the sparray contains anyone of the given values, and false otherwise
   * @param value values to search
   */
  includesAny(...values: T[]): boolean {
    return values.some(element => this.data.includes(element))
  }

  /**
   * Builds a new sparray with the reverse order
   */
  reverse(): Sparray<T> {
    return fromArray(this.toArray().reverse())
  }

  /**
   * Builds a new sparray with the elements sorted by the natural order
   */
  sort(): Sparray<T>
  /**
   * Builds a new sparray with the elements sorted by the custom sortFn
   * @param sortFn - custom sort condition
   */
  sort(sortFn: (a: T, b: T) => number): Sparray<T>
  sort(sortFn?: (a: T, b: T) => number): Sparray<T> {
    return fromArray(this.toArray().sort(sortFn))
  }

  /**
   * Builds a new sparray with the elements sorted by the criteria provided by keyFn
   * @param keyFn get sort key from object
   * @param reverse determines if the result should be reversed
   */
  sortBy<U>(keyFn: (element: T) => U | U[], reverse = false): Sparray<T> {
    const getKeys = (element: T) => {
      const keys = keyFn(element)
      if (Array.isArray(keys))
        return keys
      else
        return [keys]
    }

    const sortedData = this.toArray().sort((a, b) => {
      const keysA = getKeys(a)
      const keysB = getKeys(b)

      for (let i = 0; i < Math.min(keysA.length, keysB.length); i++) {
        if (keysA[i] < keysB[i]) return reverse ? 1 : -1
        if (keysA[i] > keysB[i]) return reverse ? -1 : 1
      }

      return 0
    })

    return fromArray(sortedData)
  }

  /**
   * Returns the min value of the sparray
   */
  min(): T | undefined {
    if (this.isEmpty())
      return undefined

    return this.data.reduce((a, b) => a < b ? a : b)
  }

  /**
   * Returns the max value of the sparray
   */
  max(): T | undefined {
    if (this.isEmpty())
      return undefined

    return this.data.reduce((a, b) => a > b ? a : b)
  }

  /**
   * Calculates the element that has the min value, privided by minByFn
   * @param keyFn function to provide a comparable value
   */
  minBy(keyFn: (element: T) => any): T | undefined {
    if (this.isEmpty())
      return undefined

    return this.data
      .map(element => ({ element, value: keyFn(element) }))
      .reduce((a, b) => a.value < b.value ? a : b)
      .element
  }

  /**
   * Calculates the element that has the max value, privided by maxByFn
   * @param keyFn function to provide a comparable value
   */
  maxBy<C>(keyFn: (element: T) => C): T | undefined {
    if (this.isEmpty())
      return undefined

    return this.data
      .map(element => ({ element, value: keyFn(element) }))
      .reduce((a, b) => a.value > b.value ? a : b)
      .element
  }

  /**
   * Builds a new sparray with the elements sliced from the original one.
   * Negative indices could be used to backward indexing.
   * @param startIndex slice from this index (inclusive). If it is not provided, it assumes the start of the sparray.
   * @param endIndex slice until this index (exclusive). If it is not provided, it assumes the end of the sparray.
   */
  slice(startIndex?: number, endIndex?: number): Sparray<T> {
    return fromArray(this.data.slice(startIndex, endIndex))
  }

  /**
   * Return the first element of the sparray.
   */
  first(): T | undefined
  /**
   * Return the first n elements of the sparray.
   * @param size the number of elements
   */
  first(size: number): Sparray<T>
  first(size?: number): T | Sparray<T> | undefined {
    if (typeof size === 'undefined')
      return this.data[0]
    else
      return fromArray(this.data.slice(0, size))
  }

  /**
   * Return the last element of the sparray.
   */
  last(): T | undefined
  /**
   * Return the last n elements of the sparray.
   * @param size the number of elements
   */
  last(size: number): Sparray<T>
  last(size?: number): T | Sparray<T> | undefined {
    if (typeof size === 'undefined')
      return this.data.at(-1)
    else
      return fromArray(this.data.slice(-size))
  }

  /**
   * Indexes the elements by a key. The result will be an object where the keys are provided by keyFn and the values are the own elements.
   * If there are duplicate keys, the last element that generated that key will be preserved.
   * The resultant object has the function toSparray() to get back a sparray
   * @see groupBy
   * @param keyFn - function to provide a key by element
   */
  indexBy<R = T>(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number): { [key: string]: R } & { toSparray: () => Sparray<{ key: string, value: R }> }
  /**
   * Indexes the elements by a key. The result will be an object where the keys are provided by keyFn and the values are provided by valueFn.
   * If there are duplicate keys, the last element that generated that key will be preserved.
   * The resultant object has the function toSparray() to get back a sparray
   * @see groupBy
   * @param keyFn - function to provide a key by element
   * @param valueFn - function to provide a value by element
   */
  indexBy<R>(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number, valueFn: (element: T, key: string, index: number, sparray: Sparray<T>) => R): { [key: string]: R } & { toSparray: () => Sparray<{ key: string, value: R }> }
  indexBy<R>(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number, valueFn?: (element: T, key: string, index: number, sparray: Sparray<T>) => R): { [key: string]: R } {
    const getValue = valueFn ?? (element => element)
    const result = this.data.reduce((acc, curr, index) => {
      const key = String(keyFn(curr, index, this))
      const value = getValue(curr, key, index, this) as R
      acc[key] = value
      return acc
    }, {} as { [key: string]: R })

    Object.defineProperty(result, 'toSparray', {
      value: (): Sparray<{ key: string, value: R }> => {
        return fromArray(Object.keys(result))
          .map(key => ({ key, value: result[key] }))
      },
      configurable: false,
      enumerable: false,
    })

    return result
  }

  /**
   * Groups the elements by a key. The result will be an object where the keys are provided by keyFn and the values are grouped as sparrays.
   * @see indexBy
   * @param keyFn  - function to provide a key by element
   */
  groupBy<R = Sparray<T>>(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number): { [key: string]: R } & { toSparray: () => Sparray<{ key: string, values: R }> }
  /**
   * Groups the elements by a key. The result will be an object where the keys are provided by keyFn and the values are provided by valuesFn.
   * @see indexBy
   * @param keyFn  - function to provide a key by element
   * @param valuesFn  - function to provide values by element
   */
  groupBy<R>(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number, valuesFn: (grouped: Sparray<T>, key: string) => R): { [key: string]: R } & { toSparray: () => Sparray<{ key: string, values: R }> }
  groupBy(keyFn: (element: T, index: number, sparray: Sparray<T>) => string | number, valuesFn?: (grouped: Sparray<T>, key: string) => any): { [key: string]: any } {
    const grouped = this.data.reduce((acc, curr, index) => {
      const key = String(keyFn(curr, index, this))
      acc[key] = [...(acc[key] ?? []), curr]
      return acc
    }, {} as { [key: string]: T[] })

    const getValues = valuesFn ?? (sparray => sparray)
    const groupedSparrays = {} as { [key: string]: any }
    for (const key of Object.keys(grouped)) {
      groupedSparrays[key] = getValues(from(grouped[key]), key)
    }

    Object.defineProperty(groupedSparrays, 'toSparray', {
      value: (): Sparray<{ key: string, values: any }> => {
        return fromArray(Object.keys(groupedSparrays))
          .map(key => ({ key, values: groupedSparrays[key] }))
      },
      configurable: false,
      enumerable: false,
    })

    return groupedSparrays
  }

  /**
   * Partitions the sparray in batches of the provided size. The step determines the size of the step before generating each partition.
   * @param size - the size of the partition
   * @param step - the size of the step. By default is the same as the size of the partition.
   */
  sliding(size: number, step = size): any {
    if (step < 1)
      throw new Error('step must be positive integer')

    const partitions = []
    for (let i = 0; i < this.length; i += step) {
      partitions.push(fromArray(this.data.slice(i, i + size)))
    }

    return fromArray(partitions)
  }

  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip sparray or array to zip
   */
  zip<S1>(toZip: SparrayOrArray<S1>): Sparray<[T, Optional<S1>]>
  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip1 sparray or array to zip
   * @param toZip2 sparray or array to zip
   */
  zip<S1, S2>(toZip1: SparrayOrArray<S1>, toZip2: SparrayOrArray<S2>): Sparray<[T, Optional<S1>, Optional<S2>]>
  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip1 sparray or array to zip
   * @param toZip2 sparray or array to zip
   * @param toZip3 sparray or array to zip
   */
  zip<S1, S2, S3>(toZip1: SparrayOrArray<S1>, toZip2: SparrayOrArray<S2>, toZip3: SparrayOrArray<S3>): Sparray<[T, Optional<S1>, Optional<S2>, Optional<S3>]>
  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip1 sparray or array to zip
   * @param toZip2 sparray or array to zip
   * @param toZip3 sparray or array to zip
   * @param toZip4 sparray or array to zip
   */
  zip<S1, S2, S3, S4>(toZip1: SparrayOrArray<S1>, toZip2: SparrayOrArray<S2>, toZip3: SparrayOrArray<S3>, toZip4: SparrayOrArray<S4>): Sparray<[T, Optional<S1>, Optional<S2>, Optional<S3>, Optional<S4>]>
  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip1 sparray or array to zip
   * @param toZip2 sparray or array to zip
   * @param toZip3 sparray or array to zip
   * @param toZip4 sparray or array to zip
   * @param toZip5 sparray or array to zip
   */
  zip<S1, S2, S3, S4, S5>(toZip1: SparrayOrArray<S1>, toZip2: SparrayOrArray<S2>, toZip3: SparrayOrArray<S3>, toZip4: SparrayOrArray<S4>, toZip5: SparrayOrArray<S5>): Sparray<[T, Optional<S1>, Optional<S2>, Optional<S3>, Optional<S4>, Optional<S5>]>
  /**
   * Create a new sparray zipping the source and any other sparray/array provided.
   * The size of the new sparray will be the size this sparray,
   * and each element of the new sparray will be an array containing the element
   * of i-th index from source and each provided sparray/array.
   *
   * @param toZip sparrays or arrays to zip
   */
  zip(...toZip: SparrayOrArray<any>[]): Sparray<[T, ...any]>
  zip(...toZip: (Sparray<any> | any[])[]): Sparray<any[]> {
    const zipped = this.data.map((element, index) => {
      return [element, ...toZip.map(array => array.at(index))]
    })

    return fromArray(zipped)
  }

  /**
   * Builds a cartesian product from this and a second sparray/array.
   * The result will be an Sparray, and each element will be an array with values from both this and that.
   *
   * @param that - sparray or array to cross
   */
  cross<S, R = [T, S]>(that: SparrayOrArray<S>): Sparray<R>
  /**
   * Builds a cartesian product from this and a second sparray/array.
   * The result will be an Sparray, and each element will be defined by combineFn.
   *
   * @param that - sparray or array to cross
   * @param combineFn - receive the objects from both sides to combine
   */
  cross<S, R>(that: SparrayOrArray<S>, combineFn: (valueThis: T, valueThat: S) => R): Sparray<R>
  cross<S>(that: SparrayOrArray<S>, combineFn?: (valueThis: T, valueThat: S) => any): Sparray<any> {
    const combine = combineFn ?? ((a, b) => [a, b])

    const data = []
    for (const v1 of this) {
      for (const v2 of that) {
        data.push(combine(v1, v2))
      }
    }
    return fromArray(data)
  }

  /**
   * Sample a single element from data
   */
  sample(): T | undefined
  /**
   * Sample n elements from data
   *
   * @param size - the number of sampled elements
   * @param withReplacement - determines if an element could be selected twice or more
   */
  sample(size: number, withReplacement: boolean): Sparray<T>
  sample(size?: number, withReplacement?: boolean): T | Sparray<T> | undefined {
    const random = (max = this.length) => Math.trunc(Math.random() * max)

    if (typeof size === 'undefined') {
      return this.data[random()]
    } else {
      if (size > this.length && !withReplacement) {
        throw new Error('cannot sample more elements than sparray size if withReplacement = false')
      }

      const sampled: T[] = []
      const available = this.toArray()

      for (let i = 0; i < size; i++) {
        const selected = random(available.length)
        sampled.push(available[selected])
        if (!withReplacement) {
          available.splice(selected, 1)
        }
      }
      return fromArray(sampled)
    }
  }

  /**
   * Returns the string representation of the sparray and its elements
   */
  toString(): string {
    if (this.isEmpty()) {
      return '[ ]'
    } else {
      return `[ ${this.join(', ')} ]`
    }
  }

}

export class NumericSparray extends Sparray<number>{

  /**
   * Sums all the elements of the sparray.
   */
  sum(): number {
    return this.data.reduce((a, b) => a + b, 0)
  }

  /**
   * Calculates the average of all the elements of the sparray.
   */
  avg(): number {
    if (this.isEmpty())
      return NaN

    return this.sum() / this.length
  }

  histogram(bins: number, range?: { min: number, max: number }): Sparray<{ start: number, end: number, count: number }> {
    if (bins < 1 || Math.trunc(bins) !== bins) {
      throw new Error('bins must be a positive integer')
    }

    const min = range?.min ?? this.min() ?? 0
    const max = range?.max ?? this.max() ?? 0
    const rangeSize = max - min
    const foldSize = rangeSize / bins

    const histogramData = []
    for (let bin = 0; bin < bins; bin++) {
      histogramData.push({
        start: (foldSize * bin) + min,
        end: (foldSize * (bin + 1)) + min,
        count: 0,
      })
    }

    for (const value of this.data) {
      if (value < min || value > max) continue

      const bin = Math.floor((value - min) / foldSize)
      if (bin === bins) {
        histogramData[bin - 1].count++
      } else {
        histogramData[bin].count++
      }
    }

    const histogram = fromArray(histogramData)
    Object.defineProperty(histogram, 'toString', {
      value: (): string => {
        const barWidth = 30
        const minValue = histogram.map(a => a.count).min() ?? 0
        const maxValue = histogram.map(a => a.count).max() ?? 0
        const tick = (maxValue - minValue) / barWidth

        const histogramCalc = histogram.map(({ start, end, count }, i) => ({
          legend: `[${start}, ${end}${i < histogram.length - 1 ? ')' : ']'}`,
          bar: '█'.repeat(Math.floor((count - minValue) / tick)),
        }))

        const legendWidth = histogramCalc.reduce((acc, curr) => Math.max(acc, curr.legend.length), 0)
        const line = '-'.repeat(legendWidth + 3 + barWidth)

        return (
          line + '\n' +
          histogramCalc.map(({ legend, bar }) => legend.padStart(legendWidth) + ' | ' + bar).join('\n') + '\n' +
          line + '\n'
        )
      },
      configurable: false,
      enumerable: false,
    })

    return histogram
  }

}
