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
const sparray = from(array)

array.push(4)
sparray.push(4) //Error - you cannot change sparrays, there is no push method

// array = [ 1, 2, 3, 4 ]
// sparray = [ 1, 2, 3 ]
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
const sparray = from(1, 2, 3)

sparray.join() // correct
sparray.push(4) // error
sparray.at() // correct
sparray.splice(1, 1) // error
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
const sparray = from(array)
```

Sparray also can be built from sets:

```js
const set = new Set([1, 1, 2, 2, 3, 3])
const sparray = from(set)
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
const sparray = from(5, 6)

const data = from(array, set, sparray)
// [ [ 1, 2 ], Set(2) { 3, 4 }, [ 5, 6 ] ]

data.flatMap(collection => from(collection))
// [ 1, 2, 3, 4, 5, 6 ]
```

### range()

Range factory allows you to create a sparray from a sequence of numbers.

You can generate a sequence from zero (inclusive) to the given number (exclusive) by passing one number:

```js
import { range } from 'sparray'

const sparray = range(5)

// [ 0, 1, 2, 3, 4 ]
```

It is also possible to provide `start` (inclusive) and `end`(exclusive) arguments:

```js
const sparray = range(5, 10)

// [ 5, 6, 7, 8, 9 ]
```

Even if you need a decrescent range:

```js
const sparray = range(10, 5)

// [ 10, 9, 8, 7, 6 ]
```

Finally, you can define the step size, to get ranges as you need:

```js
const sparray = range(10, 51, 10)

// [ 10, 20, 30, 40, 50 ]
```

### repeat

This factory allows you to repeat a given value for n times. You just need to provide the value and the number of times you want the value to be repeated:

```js
import { repeat } from 'sparray'

const sparray = repeat('hello', 3)

// [ 'hello', 'hello', 'hello' ]
```

### empty

The last factory is pretty simple, it builds an empty sparray.

```js
import { empty } from 'sparray'

const sparray = empty()

// [ ]
```

---
