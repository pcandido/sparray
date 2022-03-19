import { from, range, repeat, empty, isSparray, Sparray, NumericSparray } from './sparray'

function assertEqual<T>(actual: Sparray<T>, expected: T[]) {
  expect(actual).toEqual({ _data: expected })
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

      expect(secondSparray).toEqual({ _data: [1, 2, 3] })
    })

    it('should create a sparray from another multiple sparray', () => {
      const firstSparray = from(1, 2, 3)
      const secondSparray = from(4, 5, 6)
      const thirdSparray = from([firstSparray, secondSparray])

      expect(thirdSparray).toEqual({ _data: [{ _data: [1, 2, 3] }, { _data: [4, 5, 6] }] })
    })

    it('should create a sparray from a single set', () => {
      assertEqual(from(new Set([1, 2, 3])), [1, 2, 3])
      assertEqual(from(new Set([1, 1, 2, 3])), [1, 2, 3])
    })

    it('should create NumericSparray if given values are numeric', () => {
      const sutArguments = from(1, 2, 3)
      const sutArray = from([1, 2, 3])
      const sutSet = from(new Set([1, 2, 3]))

      expect(sutArguments).toBeInstanceOf(NumericSparray)
      expect(sutArray).toBeInstanceOf(NumericSparray)
      expect(sutSet).toBeInstanceOf(NumericSparray)
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

    it('should create NumericSparray if value is numeric', () => {
      const sut = repeat(1, 3)
      expect(sut).toBeInstanceOf(NumericSparray)
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

  describe('enumarate', () => {
    it('should return an sparray where each element is the index and value of original sparray', () => {
      const sut = from(1, 2, 3)
      const enumerated = sut.enumerate()
      assertEqual(enumerated, [{ index: 0, value: 1 }, { index: 1, value: 2 }, { index: 2, value: 3 }])
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

  describe('isEmpty', () => {
    it('should return true if sparray is empty', () => {
      const sut = empty()
      expect(sut.isEmpty()).toBe(true)
    })

    it('should return false if sparray is not empty', () => {
      const sut = from(1, 2, 3)
      expect(sut.isEmpty()).toBe(false)
    })
  })

  describe('isNotEmpty', () => {
    it('should return false if sparray is empty', () => {
      const sut = empty()
      expect(sut.isNotEmpty()).toBe(false)
    })

    it('should return true if sparray is not empty', () => {
      const sut = from(1, 2, 3)
      expect(sut.isNotEmpty()).toBe(true)
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

  describe('includes', () => {
    const sut = from(1, 2, 3)

    it('should return true if the given element exists on the sparray', () => {
      const includes = sut.includes(2)
      expect(includes).toBe(true)
    })

    it('should return false if the given element does not exist on the sparray', () => {
      const includes = sut.includes(20)
      expect(includes).toBe(false)
    })
  })

  describe('includesAll', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return true if all the given elements exists on sparray', () => {
      const includesAll = sut.includesAll(1, 2, 3)
      expect(includesAll).toBe(true)
    })

    it('should return false if any of the given elements does not exist on sparray', () => {
      const includesAll = sut.includesAll(1, 2, 30)
      expect(includesAll).toBe(false)
    })
  })

  describe('includesAny', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return true if anyone of the given elements exists on sparray', () => {
      const includesAll = sut.includesAny(5, 6, 7)
      expect(includesAll).toBe(true)
    })

    it('should return false if noone of the given elements exist on sparray', () => {
      const includesAll = sut.includesAny(6, 7, 8)
      expect(includesAll).toBe(false)
    })
  })

  describe('reverse', () => {
    it('should build a reverse-order sparray', () => {
      const sut = from(1, 2, 3)
      const reversed = sut.reverse()
      assertEqual(reversed, [3, 2, 1])
    })

    it('should return an empty sparray if empty sparray was given', () => {
      const sut = empty()
      const reversed = sut.reverse()
      assertEqual(reversed, [])
    })

    it('should not change the current sparray', () => {
      const sut = from(1, 2, 3)
      const reversed = sut.reverse()
      assertEqual(sut, [1, 2, 3])
      assertEqual(reversed, [3, 2, 1])
    })
  })

  describe('sort', () => {
    const sut = from(3, 1, 5, 4, 2)

    it('should sort by natural order if no sortFn was given', () => {
      const sorted = sut.sort()
      assertEqual(sorted, [1, 2, 3, 4, 5])
    })

    it('should not change the current sparray', () => {
      const sut = from(3, 2, 1)
      sut.sort()
      assertEqual(sut, [3, 2, 1])
    })

    it('should consider sortFn to sort sparray', () => {
      const sorted = sut.sort((a, b) => b - a)
      assertEqual(sorted, [5, 4, 3, 2, 1])
    })
  })

  describe('sortBy', () => {
    const sut = from(
      { a: 3, b: 1 },
      { a: 1, b: 3 },
      { a: 2, b: 2 },
    )

    it('should sort elements by natural order of key elements', () => {
      const sortedA = sut.sortBy(element => element.a)
      const sortedB = sut.sortBy(element => element.b)

      assertEqual(sortedA, [{ a: 1, b: 3 }, { a: 2, b: 2 }, { a: 3, b: 1 }])
      assertEqual(sortedB, [{ a: 3, b: 1 }, { a: 2, b: 2 }, { a: 1, b: 3 }])
    })

    it('should sort elements by natural-reverse order of key elements, if reverse = true', () => {
      const sortedA = sut.sortBy(element => element.a, true)
      const sortedB = sut.sortBy(element => element.b, true)

      assertEqual(sortedA, [{ a: 3, b: 1 }, { a: 2, b: 2 }, { a: 1, b: 3 }])
      assertEqual(sortedB, [{ a: 1, b: 3 }, { a: 2, b: 2 }, { a: 3, b: 1 }])
    })

    it('should sort elements considering all the criteria of sortFn', () => {
      const sut = from(
        { a: 2, b: 2 },
        { a: 1, b: 2 },
        { a: 2, b: 1 },
        { a: 3, b: 2 },
        { a: 1, b: 1 },
        { a: 3, b: 1 },
      )

      const sorted = sut.sortBy(element => [element.a, element.b])
      const toString = sorted.map(element => `${element.a}-${element.b}`).join(';')

      expect(toString).toBe('1-1;1-2;2-1;2-2;3-1;3-2')
    })
  })

  describe('min', () => {
    it('should return undefined if sparray is empty', () => {
      const sut = empty()
      const min = sut.min()
      expect(min).toBeUndefined()
    })

    it('should return the the min value according natural comparison', () => {
      const sut = from('p', 'a', 'h', 'z')
      const min = sut.min()
      expect(min).toBe('a')
    })
  })

  describe('max', () => {
    it('should return undefined if sparray is empty', () => {
      const sut = empty()
      const max = sut.max()
      expect(max).toBeUndefined()
    })

    it('should return the the max value according natural comparison', () => {
      const sut = from('p', 'a', 'h', 'z')
      const max = sut.max()
      expect(max).toBe('z')
    })
  })

  describe('minBy', () => {
    it('should return undefined if sparray is empty', () => {
      const sut = empty()
      const min = sut.minBy(a => a)
      expect(min).toBeUndefined()
    })

    it('should return the element that has the min value calculated by minByFn', () => {
      const sut = from({ a: 4, i: 0 }, { a: 2, i: 1 }, { a: 1, i: 2 }, { a: 3, i: 3 })
      const min = sut.minBy(a => a.a)
      expect(min?.i).toBe(2)
    })
  })

  describe('maxBy', () => {
    it('should return undefined if sparray is empty', () => {
      const sut = empty()
      const max = sut.maxBy(a => a)
      expect(max).toBeUndefined()
    })

    it('should return the element that has the max value calculated by maxByFn', () => {
      const sut = from({ a: 4, i: 0 }, { a: 2, i: 1 }, { a: 1, i: 2 }, { a: 3, i: 3 })
      const max = sut.maxBy(a => a.a)
      expect(max?.i).toBe(0)
    })
  })

  describe('slice', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return exacly the same sparray if no param is given', () => {
      const sliced = sut.slice()
      assertEqual(sliced, [1, 2, 3, 4, 5])
    })

    it('should return start from (inclusive) startIndex if it is given', () => {
      const sliced = sut.slice(2)
      assertEqual(sliced, [3, 4, 5])
    })

    it('should return start from (inclusive) startIndex if it is given, but backward when it is negative', () => {
      const sliced = sut.slice(-2)
      assertEqual(sliced, [4, 5])
    })

    it('should return finish on (exclusive) endIndex if it is given', () => {
      const sliced = sut.slice(0, 3)
      assertEqual(sliced, [1, 2, 3])
    })

    it('should return finish on (exclusive) endIndex if it is given, but backward when it is negative', () => {
      const sliced = sut.slice(0, -1)
      assertEqual(sliced, [1, 2, 3, 4])
    })
  })

  describe('first', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return the first element if no size is provided', () => {
      const first = sut.first()
      expect(first).toBe(1)
    })

    it('should return undefined if sparray is empty', () => {
      const first = empty().first()
      expect(first).toBeUndefined()
    })

    it('should return the first n elements if size is provided', () => {
      const first = sut.first(3)
      assertEqual(first, [1, 2, 3])
    })

    it('should return an empty array if sparray is empty and size is provided', () => {
      const first = empty().first(3)
      assertEqual(first, [])
    })
  })

  describe('last', () => {
    const sut = from(1, 2, 3, 4, 5)

    it('should return the last element if no size is provided', () => {
      const last = sut.last()
      expect(last).toBe(5)
    })

    it('should return undefined if sparray is empty', () => {
      const last = empty().last()
      expect(last).toBeUndefined()
    })

    it('should return the last n elements if size is provided', () => {
      const last = sut.last(3)
      assertEqual(last, [3, 4, 5])
    })

    it('should return an empty array if sparray is empty and size is provided', () => {
      const last = empty().last(3)
      assertEqual(last, [])
    })
  })

  describe('indexBy', () => {
    it('should return an object where keys are the index and values are the elements', () => {
      const sut = from({ a: 1 }, { a: 2 })
      const indexed = sut.indexBy(element => element.a)
      expect(indexed).toEqual({
        '1': { a: 1 },
        '2': { a: 2 },
      })
    })

    it('should return values according to valueFn', () => {
      const sut = from({ a: 1, b: 'a' }, { a: 2, b: 'b' })
      const indexed = sut.indexBy(element => element.a, element => element.b)
      expect(indexed).toEqual({
        '1': 'a',
        '2': 'b',
      })
    })

    it('should produce an object that can be turned back to sparray', () => {
      const sut = from({ a: 1 }, { a: 2 })
      const indexed = sut.indexBy(element => element.a)
      const indexedAsSparray = indexed.toSparray()
      assertEqual(indexedAsSparray, [{ key: '1', value: { a: 1 } }, { key: '2', value: { a: 2 } }])
    })

    it('should return just last element in case of duplicity of keys', () => {
      const sut = from({ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 2, b: 4 })
      const indexed = sut.indexBy(element => element.a, element => element.b)
      expect(indexed).toEqual({
        '1': 2,
        '2': 4,
      })
    })

    it('should provide the current element, index and sparray as params to keyFn', () => {
      const keyFn = jest.fn().mockReturnValue('a')
      const sut = from(1, 2, 3)
      sut.indexBy(keyFn)

      expect(keyFn).toBeCalledTimes(3)
      expect(keyFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(keyFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(keyFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })

    it('should provide the current element, calculated key, index and sparray as params to keyFn', () => {
      const valueFn = jest.fn().mockReturnValue('a')
      const sut = from(1, 2, 3)
      sut.indexBy(a => a * 2, valueFn)

      expect(valueFn).toBeCalledTimes(3)
      expect(valueFn).toHaveBeenNthCalledWith(1, 1, '2', 0, sut)
      expect(valueFn).toHaveBeenNthCalledWith(2, 2, '4', 1, sut)
      expect(valueFn).toHaveBeenNthCalledWith(3, 3, '6', 2, sut)
    })
  })

  describe('groupBy', () => {
    const sut = from({ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 2, b: 4 })

    it('should return an object where key as keys are the index and an sparray of matching elements are the values', () => {
      const groupped = sut.groupBy(element => element.a)
      expect(groupped).toEqual({
        '1': { _data: [{ a: 1, b: 1 }, { a: 1, b: 2 }] },
        '2': { _data: [{ a: 2, b: 3 }, { a: 2, b: 4 }] },
      })
    })

    it('should return values according to valuesFn', () => {
      const groupped = sut.groupBy(element => element.a, sparray => sparray.map(element => element.b))
      expect(groupped).toEqual({
        '1': { _data: [1, 2] },
        '2': { _data: [3, 4] },
      })
    })

    it('should produce an object that can be turned back to sparray', () => {
      const groupped = sut.groupBy(element => element.a)
      const grouppedSparrays = groupped.toSparray() as Sparray<unknown>
      assertEqual(grouppedSparrays, [
        { key: '1', values: { _data: [{ a: 1, b: 1 }, { a: 1, b: 2 }] } },
        { key: '2', values: { _data: [{ a: 2, b: 3 }, { a: 2, b: 4 }] } },
      ])
    })

    it('should provide the current element, index and sparray as params to keyFn', () => {
      const keyFn = jest.fn().mockReturnValue('a')
      const sut = from(1, 2, 3)
      sut.groupBy(keyFn)

      expect(keyFn).toBeCalledTimes(3)
      expect(keyFn).toHaveBeenNthCalledWith(1, 1, 0, sut)
      expect(keyFn).toHaveBeenNthCalledWith(2, 2, 1, sut)
      expect(keyFn).toHaveBeenNthCalledWith(3, 3, 2, sut)
    })

    it('should provide the groupped sparray and key as valuesFn params', () => {
      const valueFn = jest.fn().mockReturnValue('a')
      const sut = from(1, 2, 3)
      sut.groupBy(a => a <= 2 ? '<=' : '>', valueFn)

      expect(valueFn).toBeCalledTimes(2)
      expect(valueFn).toHaveBeenNthCalledWith(1, { _data: [1, 2] }, '<=')
      expect(valueFn).toHaveBeenNthCalledWith(2, { _data: [3] }, '>')
    })
  })

  describe('sliding', () => {
    const sut = from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    it('should generate partitions of given size', () => {
      const partition = sut.sliding(2)
      expect(partition).toEqual({
        _data: [
          { _data: [1, 2] },
          { _data: [3, 4] },
          { _data: [5, 6] },
          { _data: [7, 8] },
          { _data: [9, 10] },
        ],
      })
    })

    it('should generate the last partition incomplete in case of sparray.length % size > 0', () => {
      const partition = sut.sliding(6)
      expect(partition).toEqual({
        _data: [
          { _data: [1, 2, 3, 4, 5, 6] },
          { _data: [7, 8, 9, 10] },
        ],
      })
    })

    it('should repeat elements in case step < size', () => {
      const partition = sut.sliding(5, 3)
      expect(partition).toEqual({
        _data: [
          { _data: [1, 2, 3, 4, 5] },
          { _data: [4, 5, 6, 7, 8] },
          { _data: [7, 8, 9, 10] },
          { _data: [10] },
        ],
      })
    })

    it('should skip elements in case step > size', () => {
      const partition = sut.sliding(3, 5)
      expect(partition).toEqual({
        _data: [
          { _data: [1, 2, 3] },
          { _data: [6, 7, 8] },
        ],
      })
    })

    it('should throw exception if step < 1', () => {
      expect(() => sut.sliding(5, 0)).toThrow('step must be positive integer')
    })
  })

  describe('sample', () => {
    let randomSpy: jest.SpyInstance
    const sut = from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    beforeAll(() => {
      randomSpy = jest.spyOn(global.Math, 'random').mockReturnValue(0.6)
    })

    afterAll(() => {
      randomSpy.mockRestore()
    })

    it('should return a random element of sparray', () => {
      const sampled = sut.sample()
      expect(sampled).toBe(7)
    })

    it('should return undefined if sparray is empty', () => {
      const sampled = empty().sample()
      expect(sampled).toBeUndefined()
    })

    it('should return a sparray of sampled elements if size is provided', () => {
      const sampled = sut.sample(2, true)
      assertEqual(sampled, [7, 7])
    })

    it('should not repeat elements if withReplacement = false', () => {
      const sampled = sut.sample(2, false)
      assertEqual(sampled, [7, 6])
    })

    it('should return all the elements if size = sparray.length and withReplacement = false', () => {
      const sampled = sut.sample(10, false)
      assertEqual(sampled, [7, 6, 5, 8, 4, 9, 3, 2, 10, 1])
    })

    it('should throw an exception if size > sparray.length and withReplacement = false', () => {
      expect(() => sut.sample(11, false)).toThrow('cannot sample more elements than sparray size if withReplacement = false')
    })

    it('should generate samples normally if size > sparray.size and withReplacement = true', () => {
      const sampled = sut.sample(11, true)
      assertEqual(sampled, [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7])
    })
  })

  describe('toString', () => {
    it('should return "[ ]" to empty sparrays', () => {
      const sut = empty()
      expect(sut.toString()).toBe('[ ]')
    })

    it('should reuturn values separated by comma and inside brackets', () => {
      const sut = from(1, 2, 3)
      expect(sut.toString()).toBe('[ 1, 2, 3 ]')
    })
  })
})

describe('NumericSparray', () => {

  describe('sum', () => {
    it('should return 0 if sparray is empty', () => {
      const sut = new NumericSparray([])
      const sum = sut.sum()
      expect(sum).toBe(0)
    })

    it('should sum elements of the sparray', () => {
      const sut = from(1, 2, 3)
      const sum = sut.sum()
      expect(sum).toBe(6)
    })
  })

  describe('avg', () => {
    it('should return NaN if sparray is empty', () => {
      const sut = new NumericSparray([])
      const avg = sut.avg()
      expect(avg).toBeNaN()
    })

    it('should calculate average of the sparray', () => {
      const sut = from(1, 2, 3, 4, 5, 6)
      const avg = sut.avg()
      expect(avg).toBeCloseTo(3.5)
    })
  })

})
