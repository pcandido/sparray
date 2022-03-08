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
