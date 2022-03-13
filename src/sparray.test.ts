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
      const sut = from(1, 2, 3).map(a => a * 2)
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

  describe('flatMap', () => {
    const sut = from(1, 2, 3)

    it('should transform each element of sparray in a new array, and flat the array collection back to a sparray', () => {
      const flatMapped = sut.flatMap(a => new Array(a).fill(a))
      assertEqual(flatMapped, [1, 2, 2, 3, 3, 3])
    })

    it('should provide element, index and sparray as mapFn params', () => {
      const mapFn = jest.fn().mockReturnValue([])
      sut.flatMap(mapFn)

      expect(mapFn).toBeCalledTimes(3)
      expect(mapFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(mapFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
    })
  })

  describe('flat', () => {
    it('should flat the inner arrays to the main sparray to depth = 1', () => {
      const sut = from([1, 2], [3, 4], [5, 6])
      assertEqual(sut.flat(), [1, 2, 3, 4, 5, 6])
    })

    it('should flat the inner Sparrays to the main sparray to depth = 1', () => {
      const sut = from(from(1, 2), from(3, 4), from(5, 6))
      assertEqual(sut.flat(), [1, 2, 3, 4, 5, 6])
    })

    it('should flat the inner arrays to the main sparray to depth = 2', () => {
      const sut = from([[1], [2, 3]], [[4, 5], [6]])
      assertEqual(sut.flat(2), [1, 2, 3, 4, 5, 6])
    })

    it('should flat the inner Sparrays to the main sparray to depth = 2', () => {
      const sut = from(from(from(1), from(2, 3)), from(from(4, 5), from(6)))
      assertEqual(sut.flat(2), [1, 2, 3, 4, 5, 6])
    })

    it('should flat even when mix arrays and sparrays', () => {
      const sut = from([from([1], [2])], [from([3], [4])])
      assertEqual(sut.flat(3), [1, 2, 3, 4])
    })

    it('should not flat more then depth', () => {
      const sut = from([from([1], [2])], [from([3], [4])])
      assertEqual(sut.flat(2), [[1], [2], [3], [4]])
    })

    it('should stop flat non-array-like elements', () => {
      const sut = from<any>(1, [2, 3], 4)
      assertEqual(sut.flat(), [1, 2, 3, 4])
    })
  })

  describe('reduce', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should reduce the sparray according to reduceFn', () => {
      const reducedSum = sut.reduce((a, b) => a + b)
      const reducedProduct = sut.reduce((a, b) => a * b)

      expect(reducedSum).toBe(15)
      expect(reducedProduct).toBe(120)
    })

    it('should reduce the sparray according to reduceFn, and starting by a initialValue', () => {
      const reducedObj = sut.reduce((a, b) => a + b, '')
      expect(reducedObj).toBe('12345')
    })

    it('should provide previews and current elemenet, current index and sparray as reduceFn params', () => {
      const reduceFn = jest.fn().mockReturnValue('previous value')
      sut.reduce(reduceFn)

      expect(reduceFn).toBeCalledTimes(4)
      expect(reduceFn).toHaveBeenNthCalledWith(1, 1, 2, 1, sut)
      expect(reduceFn).toHaveBeenNthCalledWith(2, 'previous value', 3, 2, sut)
      expect(reduceFn).toHaveBeenNthCalledWith(3, 'previous value', 4, 3, sut)
    })
  })

  describe('reduceRight', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should reduce the sparray according to reduceFn, from right to left', () => {
      const reducedSum = sut.reduceRight((a, b) => a - b)
      const reducedProduct = sut.reduceRight((a, b) => a * b)

      expect(reducedSum).toBe(-5)
      expect(reducedProduct).toBe(120)
    })

    it('should reduce the sparray according to reduceFn, and starting by a initialValue', () => {
      const reducedObj = sut.reduceRight((a, b) => a + b, '')
      expect(reducedObj).toBe('54321')
    })

    it('should provide previews and current elemenet, current index and sparray as reduceFn params', () => {
      const reduceFn = jest.fn().mockReturnValue('previous value')
      sut.reduceRight(reduceFn)

      expect(reduceFn).toBeCalledTimes(4)
      expect(reduceFn).toHaveBeenNthCalledWith(1, 5, 4, 3, sut)
      expect(reduceFn).toHaveBeenNthCalledWith(2, 'previous value', 3, 2, sut)
      expect(reduceFn).toHaveBeenNthCalledWith(3, 'previous value', 2, 1, sut)
    })
  })

  describe('filter', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return a new sparray without the filtered out elements', () => {
      assertEqual(sut.filter(a => a > 2), [3, 4, 5])
      assertEqual(sut.filter(a => a != 3), [1, 2, 4, 5])
    })

    it('should provide element, index and sparray as filterFn params', () => {
      const filterFn = jest.fn().mockReturnValue(true)
      sut.filter(filterFn)

      expect(filterFn).toBeCalledTimes(5)
      expect(filterFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(filterFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
    })
  })

  describe('forEach', () => {
    const sut = from(1, 2, 3)

    it('should return the same (unchanged) sparray', () => {
      const returnedValue = sut.forEach(() => 'returned value')
      assertEqual(returnedValue, [1, 2, 3])
    })

    it('should provide element, index and sparray as forEachFn params', () => {
      const forEachFn = jest.fn()
      sut.forEach(forEachFn)

      expect(forEachFn).toBeCalledTimes(3)
      expect(forEachFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(forEachFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
    })
  })

  describe('distinct', () => {
    it('should return the same values if no element is repeated', () => {
      const sut = from(1, 2, 3)
      assertEqual(sut.distinct(), [1, 2, 3])
    })

    it('should remove duplicates', () => {
      const sut = from(1, 2, 2, 3, 3, 3, 4, 4, 4, 4)
      assertEqual(sut.distinct(), [1, 2, 3, 4])
    })
  })

  describe('join', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should concat all elements using "," if no argument is given', () => {
      const joinned = sut.join()
      expect(joinned).toBe('1,2,3,4,5')
    })

    it('should return just the element if it is a single element', () => {
      const sut = from(1)
      const joinned = sut.join()
      expect(joinned).toBe('1')
    })

    it('should return empty string if sparray is empty', () => {
      const sut = empty()
      const joinned = sut.join()
      expect(joinned).toBe('')
    })

    it('should concat all elements using given separator', () => {
      const joinned = sut.join('|')
      expect(joinned).toBe('1|2|3|4|5')
    })

    it('should concat all elements using given lastSeparator before the last element', () => {
      const joinned = sut.join(' | ', ' | and ')
      expect(joinned).toBe('1 | 2 | 3 | 4 | and 5')
    })

    it('should convert null and undefined to ""', () => {
      const sut = [1, undefined, null, 2]
      const joinned = sut.join()
      expect(joinned).toBe('1,,,2')
    })
  })

  describe('some', () => {
    it('should return true if one of the elements returns true to someFn', () => {
      const sut = from(1, 2, 3, 4, 5)
      const thereIsLessThan3 = sut.some(a => a < 3)
      expect(thereIsLessThan3).toBe(true)
    })

    it('should return false if no one of the elements returns true to someFn', () => {
      const sut = from(10, 20, 30, 40, 50)
      const thereIsLessThan3 = sut.some(a => a < 3)
      expect(thereIsLessThan3).toBe(false)
    })

    it('should provide element, index and sparray as someFn params', () => {
      const sut = from(1, 2, 3)
      const someFn = jest.fn().mockReturnValue(false)
      sut.some(someFn)

      expect(someFn).toBeCalledTimes(3)
      expect(someFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(someFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(someFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })
  })

  describe('every', () => {
    it('should return true if all the elements return true to everyFn', () => {
      const sut = from(1, 2, 3, 4, 5)
      const allLessThan10 = sut.every(a => a < 10)
      expect(allLessThan10).toBe(true)
    })

    it('should return false if any of the elements return false to everyFn', () => {
      const sut = from(1, 2, 3, 4, 5, 20)
      const allLessThan10 = sut.every(a => a < 10)
      expect(allLessThan10).toBe(false)
    })

    it('should provide element, index and sparray as everyFn params', () => {
      const sut = from(1, 2, 3)
      const everyFn = jest.fn().mockReturnValue(true)
      sut.every(everyFn)

      expect(everyFn).toBeCalledTimes(3)
      expect(everyFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(everyFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(everyFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })
  })

  describe('concat', () => {
    it('should accept a single arrray to concact', () => {
      const sut = from(1, 2, 3)
      const concatted = sut.concat([4, 5])
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept multiple arrays to concat', () => {
      const sut = from(1)
      const concatted = sut.concat([2, 3], [4, 5])
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept a single sparray to concat', () => {
      const sut = from(1, 2, 3)
      const concatted = sut.concat(from(4, 5))
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept multiple sparrays to concat', () => {
      const sut = from(1)
      const concatted = sut.concat(from(2, 3), from(4, 5))
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept single element to concat', () => {
      const sut = from(1, 2, 3, 4)
      const concatted = sut.concat(5)
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept multiple elements to concat', () => {
      const sut = from(1, 2, 3)
      const concatted = sut.concat(4, 5)
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })

    it('should accept arrays, sparrays and elements to concat', () => {
      const sut = from(1)
      const concatted = sut.concat([2], 3, from(4, 5))
      assertEqual(concatted, [1, 2, 3, 4, 5])
    })
  })

  describe('find', () => {
    it('should return the element that matches the findFn criteria', () => {
      const sut = from(10, 11, 12)
      const found = sut.find(a => a % 6 == 0)
      expect(found).toBe(12)
    })

    it('should return the first element that matches the findFn criteria, if there are more than one', () => {
      const sut = from(8, 10, 12, 15)
      const found = sut.find(a => a % 5 == 0)
      expect(found).toBe(10)
    })

    it('should return undefined if no element match', () => {
      const sut = from(1, 2, 3)
      const found = sut.find(a => a > 10)
      expect(found).toBeUndefined()
    })

    it('should provide element, index and sparray as findFn params', () => {
      const sut = from(1, 2, 3)
      const findFn = jest.fn().mockReturnValue(false)
      sut.find(findFn)

      expect(findFn).toBeCalledTimes(3)
      expect(findFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(findFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(findFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })
  })

  describe('findIndex', () => {
    it('should return the element that matches the findFn criteria', () => {
      const sut = from(10, 11, 12)
      const found = sut.findIndex(a => a % 6 == 0)
      expect(found).toBe(2)
    })

    it('should return the first element that matches the findFn criteria, if there are more than one', () => {
      const sut = from(8, 10, 12, 15)
      const found = sut.findIndex(a => a % 5 == 0)
      expect(found).toBe(1)
    })

    it('should return undefined if no element match', () => {
      const sut = from(1, 2, 3)
      const found = sut.findIndex(a => a > 10)
      expect(found).toBe(-1)
    })

    it('should provide element, index and sparray as findFn params', () => {
      const sut = from(1, 2, 3)
      const findFn = jest.fn().mockReturnValue(false)
      sut.findIndex(findFn)

      expect(findFn).toBeCalledTimes(3)
      expect(findFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(findFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(findFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })
  })

  describe('indexOf', () => {
    const sut = from(1, 2, 3, 3)

    it('should return the index of the found element', () => {
      const foundIndex = sut.indexOf(2)
      expect(foundIndex).toBe(1)
    })

    it('should return the first index of the found element', () => {
      const foundIndex = sut.indexOf(3)
      expect(foundIndex).toBe(2)
    })

    it('should return -1 if the element was not found', () => {
      const foundIndex = sut.indexOf(5)
      expect(foundIndex).toBe(-1)
    })
  })

  describe('lastIndexOf', () => {
    const sut = from(1, 2, 3, 3)

    it('should return the index of the found element', () => {
      const foundIndex = sut.lastIndexOf(2)
      expect(foundIndex).toBe(1)
    })

    it('should return the last index of the found element', () => {
      const foundIndex = sut.lastIndexOf(3)
      expect(foundIndex).toBe(3)
    })

    it('should return -1 if the element was not found', () => {
      const foundIndex = sut.lastIndexOf(5)
      expect(foundIndex).toBe(-1)
    })
  })
})
