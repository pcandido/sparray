import { from, range, repeat, empty, isSparray, Sparray } from './sparray'

function assertEqual<T>(actual: Sparray<T>, expected: T[]) {
  expect(actual).toEqual({ data: expected })
}

describe('Sparray factories', () => {

  describe('from', () => {

    it('should create an empty sparray if no element was providen', () => {
      assertEqual(from<number>(), [])
    })

    it('should create a sparray from a single element', () => {
      assertEqual(from(true), [true])
      assertEqual(from(1), [1])
      assertEqual(from('a'), ['a'])
      assertEqual(from({ field: 1 }), [{ field: 1 }])
    })

    it('should create a sparray from a single-value array', () => {
      assertEqual(from([true]), [true])
      assertEqual(from([1]), [1])
      assertEqual(from(['a']), ['a'])
      assertEqual(from([{ field: 1 }]), [{ field: 1 }])
    })

    it('should create a sparray with a single provided array of multiple elements', () => {
      assertEqual(from([1, 2, 3]), [1, 2, 3])
      assertEqual(from<any>([1, true, ['a'], { field: 3 }]), [1, true, ['a'], { field: 3 }])
    })

    it('should create a sparray with all the provided values', () => {
      assertEqual(from(1, 2, 3), [1, 2, 3])
      assertEqual(from<any>(1, true, ['a'], { field: 3 }), [1, true, ['a'], { field: 3 }])
    })

    it('should create a sparray from another single sparray', () => {
      const firstSparray = from(1, 2, 3)
      const secondSparray = from(firstSparray)

      expect(secondSparray).toEqual({ data: [1, 2, 3] })
    })

    it('should create a sparray from another multiple sparray', () => {
      const firstSparray = from(1, 2, 3)
      const secondSparray = from(4, 5, 6)
      const thirdSparray = from([firstSparray, secondSparray])

      expect(thirdSparray).toEqual({ data: [{ data: [1, 2, 3] }, { data: [4, 5, 6] }] })
    })

    it('should create a sparray from a single set', () => {
      assertEqual(from(new Set([1, 2, 3])), [1, 2, 3])
      assertEqual(from(new Set([1, 1, 2, 3])), [1, 2, 3])
    })

  })

  describe('range', () => {
    it('should create a range from 0 to given value (exclusive)', () => {
      assertEqual(range(3), [0, 1, 2])
      assertEqual(range(5), [0, 1, 2, 3, 4])
    })

    it('should create a range from given start (inclusive) to given end (exclusive), with step = 1', () => {
      assertEqual(range(2, 5), [2, 3, 4])
      assertEqual(range(-2, 2), [-2, -1, 0, 1])
    })

    it('should create a range from given start (inclusive) downto given end (exclusive), with step = -1', () => {
      assertEqual(range(5, 2), [5, 4, 3])
      assertEqual(range(2, -2), [2, 1, 0, -1])
    })

    it('should create a range from given start (inclusive) to given end (exclusive), with given step', () => {
      assertEqual(range(2, 10, 2), [2, 4, 6, 8])
      assertEqual(range(10, -10, -3), [10, 7, 4, 1, -2, -5, -8])
    })

    it('should throw exception if start less than end, but step is negative', () => {
      expect(() => { range(0, 5, -1) }).toThrow('Invalid step value: -1')
    })

    it('should throw exception if start greater than end, but step is positive', () => {
      expect(() => { range(5, 0, 1) }).toThrow('Invalid step value: 1')
    })

    it('should throw exception if step = 0', () => {
      expect(() => { range(0, 5, 0) }).toThrow('Invalid step value: 0')
    })
  })

  describe('repeat', () => {
    it('should create a sparray of given times the given value"', () => {
      assertEqual(repeat('hello', 5), ['hello', 'hello', 'hello', 'hello', 'hello'])
      assertEqual(repeat({ field: 2 }, 3), [{ field: 2 }, { field: 2 }, { field: 2 }])
    })

    it('should throw exception if times is negative', () => {
      expect(() => { repeat('value', -1) }).toThrow('Invalid "times" value: -1')
    })
  })

  describe('empty', () => {
    it('should create a empty sparray', () => {
      assertEqual(empty(), [])
    })
  })

})

describe('isSparray', () => {

  it('should return true if the providen value is a sparray', () => {
    const obj = from(1, 2, 3)
    const result = isSparray(obj)

    expect(result).toBe(true)
  })

  it('should return false if the providen value is NOT a sparray', () => {
    const obj = 'test'
    const result = isSparray(obj)

    expect(result).toBe(false)
  })

  it('should return false if the providen value is a simple array', () => {
    const obj = [1, 2, 3]
    const result = isSparray(obj)

    expect(result).toBe(false)
  })

})

describe('Sparray', () => {

  describe('constructor', () => {
    it('should create an sparray based on given array', () => {
      const data = [1, 2, 3]
      assertEqual(new Sparray(data), data)
    })

    it('should throw an exception if argument is not an array', () => {
      const data = 'string' as any
      expect(() => new Sparray(data)).toThrow('Invalid data value')
    })

    it('should not be impacted if the origin array changes', () => {
      const data = [1, 2, 3, 4, 5]
      const sut = new Sparray(data)
      data.push(6)

      assertEqual(sut, [1, 2, 3, 4, 5])
    })
  })

  describe('toArray', () => {
    it('should return the values of sparray as an array', () => {
      const data = [1, 2, 3]
      const sut = from(data)

      expect(sut.toArray()).toEqual(data)
    })

    it('should produce an array that does not impact sparray if changed', () => {
      const sut = from([1, 2, 3])
      const exported = sut.toArray()
      exported.push(4)

      expect(exported).toEqual([1, 2, 3, 4])
      assertEqual(sut, [1, 2, 3])
    })
  })

  describe('toSet', () => {
    it('should return a set of its elements', () => {
      const sut = from(1, 2, 3, 3)
      expect(sut.toSet()).toEqual(new Set([1, 2, 3]))
    })

    it('should produce a Set that does not impact sparray if changed', () => {
      const sut = from([1, 2, 3])
      const exported = sut.toSet()
      exported.add(4)

      expect(exported).toEqual(new Set([1, 2, 3, 4]))
      assertEqual(sut, [1, 2, 3])
    })
  })

  describe('get', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return the n-th element when use positive index', () => {
      expect(sut.get(3)).toBe(4)
    })

    it('should return elements backward for negative indices', () => {
      expect(sut.get(-2)).toBe(4)
    })

    it('should return undefined for out of bound indices', () => {
      expect(sut.get(50)).toBeUndefined()
    })
  })

  describe('keys', () => {
    it('should return an iterable of keys', () => {
      const sut = from(1, 2, 3)
      const keys = sut.keys()

      expect(keys.next()).toEqual({ value: 0, done: false })
      expect(keys.next()).toEqual({ value: 1, done: false })
      expect(keys.next()).toEqual({ value: 2, done: false })
      expect(keys.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('values', () => {
    it('should return an iterable of values', () => {
      const sut = from(1, 2, 3)
      const values = sut.values()

      expect(values.next()).toEqual({ value: 1, done: false })
      expect(values.next()).toEqual({ value: 2, done: false })
      expect(values.next()).toEqual({ value: 3, done: false })
      expect(values.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('entries', () => {
    it('should return an interable of entries', () => {
      const sut = from(1, 2, 3)
      const entries = sut.entries()

      expect(entries.next()).toEqual({ value: [0, 1], done: false })
      expect(entries.next()).toEqual({ value: [1, 2], done: false })
      expect(entries.next()).toEqual({ value: [2, 3], done: false })
      expect(entries.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('length', () => {
    it('should return the length of sparray', () => {
      const sut = from(1, 2, 3)
      expect(sut.length).toBe(3)
    })

    it('should return 0 for empty sparrays', () => {
      const sut = empty()
      expect(sut.length).toBe(0)
    })
  })

  describe('size', () => {
    it('should return the size/length of sparray', () => {
      const sut = from(1, 2, 3)
      expect(sut.size()).toBe(3)
    })

    it('should return 0 for empty sparrays', () => {
      const sut = empty()
      expect(sut.size()).toBe(0)
    })
  })

  describe('count', () => {
    const sut = from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    it('should return sparray size if no condition is given', () => {
      expect(sut.count()).toBe(10)
    })

    it('should return 0 if no element matches the conditionFn', () => {
      expect(sut.count(() => false)).toEqual(0)
    })

    it('should return sparray length if all elements match the conditionFn', () => {
      expect(sut.count(() => true)).toEqual(10)
    })

    it('should count just elements that matches the conditionFn', () => {
      expect(sut.count(a => a > 5)).toBe(5)
      expect(sut.count(a => a == 5)).toBe(1)
      expect(sut.count((a, i) => i < 2)).toBe(2)
    })

    it('should provide element, index and sparray as conditionFn params', () => {
      const conditionFn = jest.fn().mockReturnValue(true)
      sut.count(conditionFn)

      expect(conditionFn).toBeCalledTimes(10)
      expect(conditionFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(conditionFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
    })
  })

  describe('map', () => {
    it('should transform elements according to mapFn', () => {
      const sut = from(1, 2, 3).map(a => { console.log(this); return a * 2 })
      assertEqual(sut, [2, 4, 6])
    })

    it('should provide element, index and sparray as mapFn params', () => {
      const mapFn = jest.fn()
      const sut = from(1, 2, 3)
      sut.map(mapFn)

      expect(mapFn).toBeCalledTimes(3)
      expect(mapFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(mapFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
    })
  })
})
