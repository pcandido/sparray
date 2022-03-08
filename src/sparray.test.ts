import { from, isSparray, Sparray } from './sparray'

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
