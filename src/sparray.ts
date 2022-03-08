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

export class Sparray<T>{

  private data: T[]

  constructor(data: T[]) {
    this.data = data
  }

}
