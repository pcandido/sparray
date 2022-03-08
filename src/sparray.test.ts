import { from } from './sparray'

function assertEqual<T>(actual: any, expected: any[]) {
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

    it('should create a sparray with all the provided values', () => {
      assertEqual(from(1, 2, 3), [1, 2, 3])
      assertEqual(
        from<any>(1, true, ['a'], { field: 3 }),
        [1, true, ['a'], { field: 3 }],
      )
    })

  })

})
