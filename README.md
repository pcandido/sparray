# sparray

A convenient, simple, chainable, and 0-dependencies library to handle arrays/lists.

![npm](https://img.shields.io/npm/v/sparray)
![Publish Pipeline](https://img.shields.io/github/workflow/status/pcandido/sparray/publish)
![GitHub issues](https://img.shields.io/github/issues-raw/pcandido/sparray)
![Licence](https://img.shields.io/npm/l/sparray)

Jump to [📖 Table of contents](#-table-of-contents)

---
## 🚀 Getting start

1. Install **sparray** as dependency:

    `npm i sparray`

2. Import sparray or one of its factories to your module:

    `import { from } from 'sparray'`

3. Build a sparray and start using it:

    ```js
    from(1, 2, 2, 3, 3, 3)
      .distinct()
      .count()

    // 3
    ```
---
## 🧬 Concepts

###  Sparrays are immutable
You will not find any method that allows you to change a sparray (such as push, pop, etc).
Instead, any operation will always create a new sparray. Immutability helps you keep control of your data and mitigate problems due to side effects.

```js
const array = [1, 2, 3]
const spr = from(array)

array.push(4)
spr.push(4) //Error - you cannot change sparrays, there is no push method

// array = [ 1, 2, 3, 4 ]
// spr = [ 1, 2, 3 ]
```

### Sparrays are chainable
All the sparrays methods return something. Several operations (due to immutability) generate other sparray that you can continue chaining new operations.

```js
const result = from(1, 2, 3)
  .flatMap(n => repeat(n, n))
  .groupBy(n => n)
  .toSparray()
  .map(entry => entry.values)
  .flat()
  .distinct()

// [ 1, 2, 3 ]
```

### Sparrays are not arrays
Although sparray implements almost all array methods, Sparray does not implement the array interface and does not have any of those methods that modify the array data.

```js
const spr = from(1, 2, 3)

spr.join() // correct
spr.push(4) // error
spr.at() // correct
spr.splice(1, 1) // error
```

---

## 🔨 Factories

Sparray provides a few powerful factories, with which you can build sparrays and start handling your data.

### from()

The first and most powerful factory is `from()`. It allows you to build sparrays based on data you already have. You can provide literal values, both as an array or as a list of arguments:

```js
import { from } from 'sparray'

const s1 = from(1, 2, 3, 4, 5)
const s2 = from([1, 2, 3, 4, 5])
```

Of course, you can use an already in-memory array:

```js
const array = getArrayFromSomewhere()
const spr = from(array)
```

Sparray also can be built from sets:

```js
const set = new Set([1, 1, 2, 2, 3, 3])
const spr = from(set)
```

And finally, it is possible to build an sparray from another:

```js
const s1 = from(1, 2, 3)
const s2 = from(s1)
```

Note, if pass more than one array/sparray/set as arguments, the resultant sparray will not automatically flat them, but you can do it later.

```js
const array = [1, 2]
const set = new Set([3, 4])
const spr = from(5, 6)

const data = from(array, set, spr)
// [ [ 1, 2 ], Set(2) { 3, 4 }, [ 5, 6 ] ]

data.flatMap(collection => from(collection))
// [ 1, 2, 3, 4, 5, 6 ]
```

### range()

Range factory allows you to create a sparray from a sequence of numbers.

You can generate a sequence from zero (inclusive) to the given number (exclusive) by passing one number:

```js
import { range } from 'sparray'

const spr = range(5)

// [ 0, 1, 2, 3, 4 ]
```

It is also possible to provide `start` (inclusive) and `end`(exclusive) arguments:

```js
const spr = range(5, 10)

// [ 5, 6, 7, 8, 9 ]
```

Even if you need a decrescent range:

```js
const spr = range(10, 5)

// [ 10, 9, 8, 7, 6 ]
```

Finally, you can define the step size, to get ranges as you need:

```js
const spr = range(10, 51, 10)

// [ 10, 20, 30, 40, 50 ]
```

### repeat()

This factory allows you to repeat a given value for n times. You just need to provide the value and the number of times you want the value to be repeated:

```js
import { repeat } from 'sparray'

const spr = repeat('hello', 3)

// [ 'hello', 'hello', 'hello' ]
```

### empty()

The last factory is pretty simple, it builds an empty sparray.

```js
import { empty } from 'sparray'

const spr = empty()

// [ ]
```

---

## 🧮 Operations

Here you will find all the operations you can do with your Sparray.

### at()
It is the most common way to get an element of a specific position of a sparray. It takes an index as param. If negative, the search will be backward.

```js
const spr = from(1, 2, 3, 4, 5)

spr.at(0) // 1
spr.at(1) // 2
spr.at(-1) // 5
spr.at(-2) //4
spr.at(10) //undefined
```

### keys()
As in arrays, `keys()` returns an iterator of sparray indices.

```js
const spr = from(1, 2, 3, 4, 5)

for(const key of spr.keys()){
  console.log(key)
}

// 0
// 1
// 2
// 3
// 4
```

### values()
As in arrays, `values()` returns an iterator of sparray values.

```js
const spr = from(1, 2, 3, 4, 5)

for(const value of spr.keys()){
  console.log(value)
}

// 1
// 2
// 3
// 4
// 5
```

### entries()
As in arrays, `entries()` returns an iterator of sparray indices and values. Each value will be an array, being the first element the index and the second one the value.

```js
const spr = from(1, 2, 3, 4, 5)

for(const [key, value] of spr.entries()){
  console.log(key, value)
}

// 0 1
// 1 2
// 2 3
// 3 4
// 4 5
```

### enumerate()
Similar to entries, `enumerate()` exposes the index and value for each element, but instead of returning an iterator, the return is a sparray. Each element of resultant sparray is an object containing `index` and `value`.

```js
const spr = from(1, 2, 3, 4, 5)
spr.enumerate()

// [
//   {index: 0, value: 1},
//   {index: 1, value: 2},
//   {index: 2, value: 3},
//   {index: 3, value: 4},
//   {index: 4, value: 5}
// ]
```

### length
It is a property of sparray and reveals its number of elements.

```js
const spr = from(1, 2, 3, 4, 5)
spr.length

// 5
```

### size()
As `length`, `size()` reveals the sparray number of elements.

```js
const spr = from(1, 2, 3, 4, 5)
spr.size()

// 5
```

### count()
As `length` and `size()`, `count` will return the number of elements of the sparray. But `count()` also can count just elements that match a condition, expressed by a `conditionFn`.

```js
const spr = from(1, 2, 3, 4, 5)

spr.count() // 5
spr.count(element => element < 3) // 2
spr.count((element, index, sparray) => index > 3) // 1
```

### isEmpty()
Determines if sparray is or not empty.

```js
empty().isEmpty() // true
from(1, 2, 3).isEmpty() // false
```

### isNotEmpty()
Determines if sparray is or not empty.

```js
empty().isNotEmpty() // false
from(1, 2, 3).isNotEmpty() // true
```

### toString()
Generates a string representation of sparray.

```js
const spr = from(1, 2, 3, 4, 5)
spr.toString()

// '[ 1, 2, 3, 4, 5 ]'
```

### toArray()
Generates a new array, based on sparray data.

```js
const spr = from(1, 2, 3, 4, 5)
spr.toArray()

// [ 1, 2, 3, 4, 5 ]
```

Note changes on the generated array will not reflect on sparray.

```js
const spr = from(1, 2, 3, 4, 5)
const array = spr.toArray()

array.push(6)

// array = [ 1, 2, 3, 4, 5, 6 ]
// spr = [ 1, 2, 3, 4, 5 ]
```

### toSet()
Generates a new Set, based on sparray data.

```js
const spr = from(1, 2, 3, 1, 2, 3)
spr.toSet()

// Set(3) { 1, 2, 3 }
```

Note changes on generated set will not reflect on sparray.

```js
const spr = from(1, 2, 3, 1, 2, 3)
const set = spr.toSet()

set.add(4)

// spr = [ 1, 2, 3, 1, 2, 3 ]
// set = Set(4) { 1, 2, 3, 4 }

```

### map()
Transform elements of sparray. For each element on sparray, `mapFn` will be called with the element itself, its index, and the entire sparray as params. All the `mapFn` returns will form the transformed sparray. Note the original sparray does not change.

```js
const spr = from(1, 2, 3, 4, 5)
const mapped = spr.map((value, index, sparray) => value * 2)

// spr = [ 1, 2, 3, 4, 5 ]
// mapped = [ 2, 4, 6, 8, 10 ]
```

### flatMap()
Different of `map()`, `flatMap()` expects an array or sparray as return of `mapFn`. The returned collections will be spread/flat onto the resultant sparray.

```js
const spr = from(1, 2, 3)
const mapped = spr.map((value, index, sparray) => repeat(value, value))
const flatMapped = spr.flatMap((value, index, sparray) => repeat(value, value))

// mapped = [ [ 1 ], [ 2, 2 ], [ 3, 3, 3 ] ]
// flatMapped = [ 1, 2, 2, 3, 3, 3 ]
```

### flat()
Flats the inner arrays/sparrays to the root sparray.

```js
const spr = from([1, 2, 3], [4, 5, 6])
const flatted = spr.flat()

//spr = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
//flatted = [ 1, 2, 3, 4, 5, 6 ]
```

It is also possible to determine how depth the flat operation should reach. `0` will not flat anything, `1` will flat the first level of arrays/sparrays, and so on.

```js
const spr = from([1, [2, [3, [4]]]])
const level0 = spr.flat(0)
const level1 = spr.flat(1)
const level2 = spr.flat(2)
const level3 = spr.flat(3)
const level4 = spr.flat(4)

// level0 = [ 1, [ 2, [ 3, [ 4 ] ] ] ]
// level1 = [ 1, 2, [ 3, [ 4 ] ] ]
// level2 = [ 1, 2, 3, [ 4 ] ]
// level3 = [ 1, 2, 3, 4 ]
// level4 = [ 1, 2, 3, 4 ]
```

### reduce()
Reduce the values of sparray by accumulating their values in an accumulator, from the first to the last element. When all elements were processed, the accumulated value is returned.

For each element, `reduceFn` will receive the accumulated value, the current element, the current index, and finally, the sparray itself.

```js
const spr = from(1, 2, 3, 4, 5)
spr.reduce((accumulated, current, currentIndex, sparray) => accumulated + current)

// 15
```

At the first pass, the first element is given as accumulated value while the second one is given as current. But it is also possible to provide an initial value. In this case, at the first pass, the initial value is given as accumulated value while the first element is given as current.

```js
const spr = from(1, 2, 3, 4, 5)
spr.reduce((accumulated, current) => accumulated + current, -10)

// 5
```

### reduceRight()
Reduce the values of sparray by accumulating their values in an accumulator, from the last to the first element. When all elements were processed, the accumulated value is returned.

For each element, `reduceFn` will receive the accumulated value, the current element, the current index, and finally, the sparray itself.

```js
const spr = from(1, 2, 3, 4, 5)
spr.reduceRight((accumulated, current) => accumulated - current)

// -5
```

At the first pass, the last element is given as accumulated value while the second last one is given as current. But it is also possible to provide an initial value. In this case, at the first pass, the initial value is given as accumulated value while the last element is given as current.

```js
const spr = from(1, 2, 3, 4, 5)
spr.reduceRight((accumulated, current) => accumulated - current, 20)

// 5
```

### filter()
Creates a new sparray with only the elements that match criteria, i.e. elements that returned true to `filterFn`.

```js
const spr = from(1, 2, 3, 4, 5)
spr.filter((element, index, sparray) => element & 2 === 0)

// [ 2, 4 ]
```

### forEach()
Pass through all the elements of sparray and calls `forEachFn` to each one, with the element, its index and the entire sparray. Differently of array, sparray's forEach returns itself, so that you can continue chaining the methods.

```js
const spr = from(1, 2, 3)

const count = spr
  .forEach((element, index, sparray) => console.log(element))
  .count()

// console:
//   1
//   2
//   3

//count = 3
```

Note `forEachFn` return is completely ignored. If you need to use the return, consider using `map()` instead.

```js
const spr = from(1, 2, 3)
const spr2 = spr.forEach(element => element * 2)
const spr3 = spr.map(element => element * 2)

// spr = [ 1, 2, 3 ]
// spr2 = [ 1, 2, 3 ]
// spr3 = [ 2, 4, 6 ]
```

### distinct()
Removes all the duplicated values from sparray. In terms of element order, only the first occurrence will be preserved.

```js
const spr = from(1, 2, 2, 3, 2, 3)
spr.distinct()

// [ 1, 2, 3 ]
```

### join()
Builds a string joining all the elements of sparray. The default separator is the `,` (comma), but it is possible to provide the desired separator.

```js
const spr = from(1, 2, 3, 4, 5)
spr.join(' | ')

// '1 | 2 | 3 | 4 | 5'
```

It is also possible to change only the last separator.

```js
const spr = from(1, 2, 3, 4, 5)
spr.join(', ', ', and ')

// '1, 2, 3, 4, and 5'
```

### some()
Returns true if **any** of the sparray elements match the `someFn` criteria. Returns false otherwise.

```js
const spr = from(1, 2, 3, 4, 5)

const hasLessThan10 = spr.some((element, index, sparray) => element < 10)
const hasGreaterThan10 = spr.some((element, index, sparray) => element > 10)

// hasLessThan10 = true
// hasGreaterThan10 = false
```

### every()
Returns true if **all** of the sparray elements match the `everyFn` criteria. Returns false otherwise.

```js
const spr = from(1, 2, 3, 4, 5)

const hasLessThan10 = spr.some((element, index, sparray) => element < 10)
const hasGreaterThan3 = spr.some((element, index, sparray) => element > 3)

// hasLessThan10 = true
// hasGreaterThan3 = false
```

### concat()
Generates a new sparray, concatenating the provide arrays/sparrays/elements.

```js
const spr = from(1, 2, 3)
spr.concat(range(4,7), [7, 8, 9], 10)

// [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

### find()
Returns the first element that matches the `findFn` criteria. If no element matches, undefined is returned.

```js
const spr = from(1, 2, 3)

const found1 = spr.find((element, index, sparray) => element > 1)
const found2 = spr.find(element => element > 5)

// found1 = 2
// found2 = undefined
```

### findIndex()
Returns the index of the first element that matches the `findFn` criteria. If no element matches, `-1` is returned.

```js
const spr = from(1, 2, 3)

const found1 = spr.findIndex((element, index, sparray) => element > 1)
const found2 = spr.findIndex(element => element > 5)

// found1 = 1
// found2 = -1
```

### indexOf()
Returns the first index of given element. If element is not in sparray, returns `-1`.

```js
const spr = from(1, 2, 3)

const index2 = spr.indexOf(2)
const index5 = spr.indexOf(5)

// index2 = 1
// index5 = -1
```

### lastIndexOf()
Returns the last index of given element. If element is not in sparray, returns `-1`.

```js
const spr = from(1, 2, 3, 1, 2, 3)

const index2 = spr.indexOf(2)
const index5 = spr.indexOf(5)

// index2 = 4
// index5 = -1
```

### includes()
Returns `true` if sparray has the given element. Returns `false` otherwise.

```js
const spr = from(1, 2, 3)

const includes2 = spr.includes(2)
const includes5 = spr.includes(5)

// includes2 = true
// includes5 = false
```

### includesAll()
Returns `true` if sparray has all the given elements. Returns `false` otherwise.

```js
const spr = from(1, 2, 3, 4, 5)

const includes3_4_5 = spr.includesAll(3, 4, 5)
const includes4_5_6 = spr.includesAll(4, 5, 6)

// includes3_4_5 = true
// includes4_5_6 = false
```

### includesAny()
Returns `true` if sparray has any of the given elements. Returns `false` otherwise.

```js
const spr = from(1, 2, 3, 4, 5)

const includes4_5_6 = spr.includesAll(4, 5, 6)
const includes6_7_8 = spr.includesAll(6, 7, 8)

// includes4_5_6 = true
// includes6_7_8 = false
```

### reverse()
Generates a new sparray in the reverse order. Note the original sparray is not changed.

```js
const spr = from(1, 2, 3)
const reversed = spr.reverse()

// spr = [ 1, 2, 3 ]
// reversed = [ 3, 2, 1 ]
```

### first()
Returns the first element of the sparray. Equivalent to `.at(0)`.

```js
const spr = from(1, 2, 3)
spr.first()

// 1
```

It is also possible to ask for the first `n` elements. In this case a new sparray will be returned. Equivalent to `.slice(0, n)`.

```js
const spr = from(1, 2, 3, 4, 5)
spr.first(3)

// [ 1, 2, 3 ]
```

### last()
Returns the last element of the sparray. Equivalent to `.at(-1)`.

```js
const spr = from(1, 2, 3)
spr.last()

// 3
```

It is also possible to ask for the last `n` elements. In this case a new sparray will be returned. Equivalent to `.slice(-n)`.

```js
const spr = from(1, 2, 3, 4, 5)
spr.last(3)

// [ 3, 4, 5 ]
```

### sort()
Sorts the elements of the sparray. If no `sortFn` is provided, the elements will be sorted by their natural order. Note a new sparray is generated, and the original one does not change.

```js
const spr = from(2, 5, 3, 1, 4)
const sorted = spr.sort()

// spr = [ 2, 5, 3, 1, 4 ]
// sorted = [ 1, 2, 3, 4, 5 ]
```

The `sortFn` receive a pair of elements and should determine which one is greatest. A returned value less than zero (`< 0`) means the first element should be placed before the second. A returned value greater than zero (`> 0`) means the first element should be placed after the second. A returned value equal to zero (`=== 0`) means both elements have the same order value.

```js
const spr = from(2, 5, 3, 1, 4)

const didactic = spr.sort((el1, el2) => {
  if (el1 < el2) return -1
  if( el1 > el2) return 1
  return 0
})

const straightforward = spr.sort((el1, el2) => el1 - el2)

// spr = [ 2, 5, 3, 1, 4 ]
// didactic = [ 1, 2, 3, 4, 5 ]
// straightforward = [ 1, 2, 3, 4, 5 ]
```

### sortBy()
Sorts the elements by natural order of the value returned by `keyFn`.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 5, b: 2},
  {a: 1, b: 3},
  {a: 4, b: 4},
  {a: 2, b: 5},
)

spr.sortBy(element => element.a)

// {a: 1, b: 3},
// {a: 2, b: 5},
// {a: 3, b: 1},
// {a: 4, b: 4},
// {a: 5, b: 2}
```

It is also possible to sort elements by a key in reverse order.

```js
const spr = from(1, 2, 3)
spr.sortBy(element => element % 3, true)

// [ 2, 1, 3 ]
```

### min()
Returns the minimum value of sparray, considering the natural order.

```js
const spr = from(2, 5, 3, 1, 4)
spr.min()

// 1
```

### max()
Returns the maximum value of sparray, considering the natural order.

```js
const spr = from(2, 5, 3, 1, 4)
spr.max()

// 5
```

### minBy()
Returns the minimum value of sparray, considering the natural order of a key determined by the `keyFn`.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 5, b: 2},
  {a: 1, b: 3},
  {a: 4, b: 4},
  {a: 2, b: 5},
)

spr.minBy(element => element.a)

// {a: 1, b: 3}
```

### maxBy()
Returns the maximum value of sparray, considering the natural order of a key determined by the `keyFn`.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 5, b: 2},
  {a: 1, b: 3},
  {a: 4, b: 4},
  {a: 2, b: 5},
)

spr.maxBy(element => element.a)

// {a: 5, b: 2}
```

### slice()
Returns a new sparray with a slice of the original one. If just a parameter `n` is provided, the slice will be from the `n`-th element (inclusive) to the end of sparray.

```js
const spr = from(1, 2, 3, 4, 5)
spr.slice(3)

// [ 4, 5 ]
```

If two parameters are provided, the slice will be from the the first index (inclusive) to the second index (exclusive).

```js
const spr = from(1, 2, 3, 4, 5)
spr.slice(1, 4)

// [ 2, 3, 4 ]
```

Note is also possible to use negative/backward indices.

```js
const spr = from(1, 2, 3, 4, 5)

const slice1 = spr.slice(-4)
const slice2 = spr.slice(-4, 4)

// [ 2, 3, 4, 5 ]
// [ 2, 3, 4 ]
```

### indexBy()
Indexes the elements of the sparray according to the key returned by `keyFn`. The resultant value is an object, where keys are the indexed keys, and values are the elements themselves. Note if there are multiple elements that returns the same key, just the last will be indexed (if it was not you expected, see groupBy).

```js
const spr = from(
  { a: 3, b: 1 },
  { a: 2, b: 2 },
  { a: 1, b: 3 },
  { a: 2, b: 4 },
)
spr.indexBy((element, index, sparray) => element.a)

// {
//   '1': { a: 1, b: 3 },
//   '2': { a: 2, b: 4 },
//   '3': { a: 3, b: 1 },
// }
```

It is also possible to provide a `valueFn`, to handle the value from each key.

```js
const spr = from(
  { a: 3, b: 1 },
  { a: 2, b: 2 },
  { a: 1, b: 3 },
  { a: 2, b: 4 },
)
spr.indexBy(
  (element, index, sparray) => element.a,
  (element, key, index, sparray) => element.b,
)

// {
//   '1': 3,
//   '2': 4,
//   '3': 1,
// }
```

Finally, it is possible to get back to sparray structure, and continue chaining.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 2, b: 2},
  {a: 1, b: 3},
  {a: 2, b: 4},
)
spr.indexBy(e => e.a, e => e.b).toSparray()

// [
//   { key: '1', value: 3 },
//   { key: '2', value: 4 },
//   { key: '3', value: 1 },
// ]
```

### groupBy()
Similar to `indexBy`, but return a sparray of elements instead of only the last one that match with a specific key.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 2, b: 2},
  {a: 1, b: 3},
  {a: 2, b: 4},
)
spr.groupBy((element, index, sparray) => element.a)

// {
//   '1': [ { a: 1, b: 3 } ],
//   '2': [ { a: 2, b: 2 }, { a: 2, b: 4 } ],
//   '3': [ { a: 3, b: 1 } ],
// }
```

It is also possible to handle values by `valuesFn`.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 2, b: 2},
  {a: 1, b: 3},
  {a: 2, b: 4},
)
spr.groupBy(
  (element, index, sparray) => element.a,
  (grouped, key) => grouped.size(),
)

// {
//   '1': 1,
//   '2': 2,
//   '3': 1,
// }
```

Finally, it is possible to get back to sparray structure, and continue chaining.

```js
const spr = from(
  {a: 3, b: 1},
  {a: 2, b: 2},
  {a: 1, b: 3},
  {a: 2, b: 4},
)
spr.groupBy(e => e.a).toSparray()

// [
//   { key: '1', values: [ { a: 1, b: 3 } ] },
//   { key: '2', values: [ { a: 2, b: 2 }, { a: 2, b: 4 } ] },
//   { key: '3', values: [ { a: 3, b: 1 } ] },
// ]
```

### sliding()
Partitions the sparray in sub-sparrays of given size.

```js
const spr = range(1, 11)
spr.sliding(3)

// [
//   [ 1, 2, 3 ],
//   [ 4, 5, 6 ],
//   [ 7, 8, 9 ],
//   [ 10 ],
// ]
```

It is also possible to change the step size, so that creating overlaps or holes between partitions.

```js
const spr = range(1, 11)
const sliding1 = spr.sliding(3, 2)
const sliding2 = spr.sliding(3, 4)

// sliding1 = [
//   [ 1, 2, 3 ],
//   [ 3, 4, 5 ],
//   [ 5, 6, 7 ],
//   [ 7, 8, 9 ],
//   [ 9, 10 ],
// ]

// sliding2 = [
//   [ 1, 2, 3 ],
//   [ 5, 6, 7 ],
//   [ 9, 10 ],
// ]
```

### zip()
Generates a new sparray with each element being an array. Each position `i-th` of the new sparray will be the `i-th` element of the original sparray plus the other provided arrays/sparrays. The first element of the internal array will be from the original sparray, and each subsequent element will be defined according to the provided arrays/sparrays.

```js
const spr = from(1, 2, 3, 4, 5)
const toZip1 = from(6, 7, 8, 9, 10, 11, 12)
const toZip2 = ['a', 'b', 'c']

spr.zip(toZip1, toZip2)

// [
//   [ 1, 6, 'a' ],
//   [ 2, 7, 'b' ],
//   [ 3, 8, 'c' ]
//   [ 4, 9, undefined ]
//   [ 5, 10, undefined ]
// ]
```

### cross()
Generates a new sparray with Cartesian Product from the sparray and another sparray/array.

```js
const spr1 = from('J', 'Q', 'K')
const spr2 = from('♠', '♥', '♦', '♣')

spr.cross(spr2)

// [
//   [ 'J', '♠' ],
//   [ 'J', '♥' ],
//   [ 'J', '♦' ],
//   [ 'J', '♣' ],
//   [ 'Q', '♠' ],
//   [ 'Q', '♥' ],
//   [ 'Q', '♦' ],
//   [ 'Q', '♣' ],
//   [ 'K', '♠' ],
//   [ 'K', '♥' ],
//   [ 'K', '♦' ],
//   [ 'K', '♣' ],
// ]
```

It is also possible to provide a `combineFn` that receives both elements and return a combined value.

```js
const spr1 = from('J', 'Q', 'K')
const spr2 = from('♠', '♥', '♦', '♣')

spr.cross(spr2, (el1, el2) => `${el1}${el2}`)

// [
//   'J ♠',
//   'J ♥',
//   'J ♦',
//   'J ♣',
//   'Q ♠',
//   'Q ♥',
//   'Q ♦',
//   'Q ♣',
//   'K ♠',
//   'K ♥',
//   'K ♦',
//   'K ♣',
// ]
```

### sample()
Returns a randomly selected value from sparray.

```js
const spr = from(1, 2, 3, 4, 5)
const v1 = spr.sample()
const v2 = spr.sample()

// v1 = 2
// v2 = 5
```

If an integer is provided, the sparray will select this quantity of samples. It will be necessary to define if the selected values could or could not be selected again.

```js
const spr = from(1, 2, 3, 4, 5)
const s1 = spr.sample(3, false)
const s2 = spr.sample(3, true)

// s1 = [ 1, 4, 2 ]
// s2 = [ 3, 4, 3 ]
```

## 🧮 Numeric Operations

NumericSparray is a special type of Sparray, which all its elements are numbers. In this case, there are special operations could be performed.

### sum()
Sums all the elements of the sparray.

```js
const spr = from(1, 2, 3, 4, 5)
spr.sum()

// 15
```

### avg()
Calculates the average of all the elements of the sparray.

```js
const spr = from(1, 2, 3, 4, 5)
spr.avg()

// 3
```

---
## 📖 Table of contents

- [sparray](#sparray)
  - [🚀 Getting start](#-getting-start)
  - [🧬 Concepts](#-concepts)
    - [Sparrays are immutable](#sparrays-are-immutable)
    - [Sparrays are chainable](#sparrays-are-chainable)
    - [Sparrays are not arrays](#sparrays-are-not-arrays)
  - [🔨 Factories](#-factories)
    - [from()](#from)
    - [range()](#range)
    - [repeat()](#repeat)
    - [empty()](#empty)
  - [🧮 Operations](#-operations)
    - [at()](#at)
    - [keys()](#keys)
    - [values()](#values)
    - [entries()](#entries)
    - [enumerate()](#enumerate)
    - [length](#length)
    - [size()](#size)
    - [count()](#count)
    - [isEmpty()](#isempty)
    - [isNotEmpty()](#isnotempty)
    - [toString()](#tostring)
    - [toArray()](#toarray)
    - [toSet()](#toset)
    - [map()](#map)
    - [flatMap()](#flatmap)
    - [flat()](#flat)
    - [reduce()](#reduce)
    - [reduceRight()](#reduceright)
    - [filter()](#filter)
    - [forEach()](#foreach)
    - [distinct()](#distinct)
    - [join()](#join)
    - [some()](#some)
    - [every()](#every)
    - [concat()](#concat)
    - [find()](#find)
    - [findIndex()](#findindex)
    - [indexOf()](#indexof)
    - [lastIndexOf()](#lastindexof)
    - [includes()](#includes)
    - [includesAll()](#includesall)
    - [includesAny()](#includesany)
    - [reverse()](#reverse)
    - [first()](#first)
    - [last()](#last)
    - [sort()](#sort)
    - [sortBy()](#sortby)
    - [min()](#min)
    - [max()](#max)
    - [minBy()](#minby)
    - [maxBy()](#maxby)
    - [slice()](#slice)
    - [indexBy()](#indexby)
    - [groupBy()](#groupby)
    - [sliding()](#sliding)
    - [zip()](#zip)
    - [cross()](#cross)
    - [sample()](#sample)
  - [🧮 Numeric Operations](#-numeric-operations)
    - [sum()](#sum)
    - [avg()](#avg)
  - [📖 Table of contents](#-table-of-contents)
