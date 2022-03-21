# sparray

A convenient, simple, chainable, and 0-dependencies library to handle arrays/lists.

![npm](https://img.shields.io/npm/v/sparray)
![Publish Pipeline](https://img.shields.io/github/workflow/status/pcandido/sparray/publish)
![GitHub issues](https://img.shields.io/github/issues-raw/pcandido/sparray)
![Licence](https://img.shields.io/npm/l/sparray)

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

###  Sparrays are immutable.
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
It is the most common way to get an element of a specific position of an sparray. It takes an index as param. If negative, the search will be backward.

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
Similar to entries, `enumerate()` exposes the index and value for each element, but instead of return an iterator, the return is an sparray. Each element of resultant sparray is an object containing `index` and `value`.

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
As `length` and `size()`, `count` will return the number of elements of the sparray. But `count()` also can count just elements that match a condition, expressed by a conditionFn.

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

Note changes on generated array will not reflect on sparray.

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

// set = Set(4) { 1, 2, 3, 4 }
// spr = [ 1, 2, 3, 1, 2, 3 ]

```

### map()
### flatMap()
### flat()
### reduce()
### reduceRight()
### filter()
### forEach()
### distinct()
### join()
### some()
### every()
### concat()
### find()
### findIndex()
### indexOf()
### lastIndexOf()
### includes()
### includesAll()
### includesAny()
### reverse()
### first()
### last()
### sort()
### sortBy()
### min()
### max()
### minBy()
### maxBy()
### slice()
### indexBy()
### groupBy()
### sliding()
### zip()
### cross()
### sample()

### sum()
### avg()
