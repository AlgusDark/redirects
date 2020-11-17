---
title: What is and how can we Test something?
description: Smashing keys until something works or stops working.
tags: [JavaScript, Programming]
date: 2019-10-12
draft: true
---
According to the oxford dictionary, testing is revealing a person's capabilities by putting
them under strain, and some people can feel that about tests in programming.

Software testing is the process to evaluate the functionality of an application so we can
get those scenarios that could lead to an error that could be annoying for the end-user
or worst, be a millionaire mistake. Meeting the requirements of a really big application
can be remarkably hard, also humans are writing that application, making it very easy
to fail in some time.

Everyone wants to deliver the best quality, free of error product to their clients, but
to be honest this is nearly impossible. We have different techniques for doing that and
I'm going to talk only in some of the points I feel is more important and what
I currently I'm doing/learning.

**White Box Testing** and **Black Box Testing** are two of the definitions that are
primordial in testing software. The first one is based on the application's internal
code structure while the second one evaluates the functionality of the software
under test without looking at the internal code structure.

Most of the developers focus on _white box testing_ because they focus mainly on
functionality. Isn't bad at all, but I hope that after reading this you can
understand why I think that both are necessary and how to make a balance between
them so we can get better confidence with our tests.

Let's imagine that we have to develop a calculator and we have the following code:

```js
const sum = (a, b) => a + b;
const add = (a, b) => a - b;
```

We're going to have some trouble if we use this implementation. We don't care about the solution but on how we can get that error before releasing that bug in production.

Let's write a test for it:
```js
const actual = add(21, 2);
const expected = 42;

console.log(actual == expected) // false ╥﹏╥
```

But it would be nice to have a better way to know that we did something wrong instead of a log in the console, something more aggressive:
```js
throw new Error(`${actual} is not equal to ${expected}`);
```

Before I mentioned that we need to run tests, so let's create a way of running more than one test.

First, we're going to create a function to wrap the functionality of our assertions:
```js
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`);
      }
    }
  };
}
```

And then we're going to isolate each test in blocks that contain a title so we can know which test is good or wrong:
```js
function test(title, suite) {
  try {
    suite(expect); // we inject our assertion utility
    console.log(`✓ ${title}`);
  } catch (error) {
    console.error(`✕ ${title}`);
    console.error(error);
  }
}
```

So, let's create our tests:
```js
test("sum function sums numbers", expect => {
  const result = sum(40, 2);
  const expected = 42;

  expect(result).toBe(expected);
  //✓ sum function sums numbers
});

test("add function adds numbers", expect => {
  const result = add(21, 2);
  const expected = 42;

  expect(result).toBe(expected);
  // ✕ add function adds numbers
  // Error: 19 is not equal to 42
});
```

Awesome, we just build some tests for our calculator module. But we don't need to create
the **test** or the **assertion** _library_, there are plenty of them. The most popular
tool is [JEST](https://jestjs.io/), although I'm not a fan of how they populate their
tools in the global scope, I believe it is the best choice for how many options it has
and there are tons of information out there on the internet.

**Unit Testing** is focused on the individual modules of the source code while
**Integration Testing** tests how these modules interact between them. _Integration tests_
will give you more confidence because it's getting more close to the real implementation
of these modules. In our example we isolated each case in different cases, making these
as _unit tests_. In a bigger application, we're going to encounter with modules that
need others to operate and there is when we are going to import them in our tests.
It is also possible that these modules are using logic internally and are going to be
a black box for us, making it hard to know about it. That's when is time for use other
technique.

**Mocks** are modules that replace the dependencies with others that simulate the behavior
of the real ones. Let's say that you have a payment service API that you want to test to
see if in your application the user is able to purchase a product. Unless you have
unlimited money, _integration test_ would be good as you can ensure that the service
is working. In this case, we need to _mock_ the service and go with a _unit test_
instead of an _integration test_. Another reason for using this could be that the
service is down or you have some problems with your internet.

Let's imagine that we are developing a new game for a new generation console. The game we
are going to develop is the super popular "_Rock, Scissors, Paper_":

```js
// choices.js
export default new Map([
  ['rock', 0],
  ['scissors', 1],
  ['paper', 2],
])
```

```js
// game.js
import choices from './choices'
import cpu from './cpu'

export default function game(user){
  const CPU = cpu.choice()
  const results = getWinner(user, CPU)
  if(results < 0){
    return 'Computer Won'
  }
  else if(results > 0){
    return 'You Won'
  }
  return 'Tie'
}

/**
 * Returns 0 if it's a tie. 1 if choice1 beats choice2,
 * and -1 otherwise.
 *  
 * @param {'rock' | 'scissors' | 'paper'} choice1
 * @param {'rock' | 'scissors' | 'paper'} choice2 
 * 
 * @returns {number}
 */
function getWinner(choice1, choice2) {
  let p1 = choices.get(choice1);
  let p2 = choices.get(choice2);

  if (p1 === p2) return 0;

  const nextPos = p1 === choices.size - 1 ? 0 : p1 + 1;

  if (nextPos === p2) return 1;

  return -1;
}
```

The function that we're missing here is `cpu.choice`:
```js
// cpu.js
import choices from "./choices";

/**
 * @returns {'rock' | 'scissors' | 'paper'}
 */
function choice() {
 return [...choices.keys()][Math.floor(Math.random() * Math.floor(3))];
}

export default { choice };
```

We want to have full control of the expected outputs in our tests and this will
make it impossible as we have a random result every time that we want to run it.

First, let's create some tests with the previous test framework we did:
```js
import test from "./test";
import game from "./game";

test("User can win against CPU", expect => {
  const result = game('rock');
  const expected = 'You Won';

  expect(result).toBe(expected);
});

test("User can lose against CPU", expect => {
  const result = game('rock');
  const expected = 'Computer Won';

  expect(result).toBe(expected);
});

test("User can tie against CPU", expect => {
  const result = game('rock');
  const expected = 'Tie';

  expect(result).toBe(expected);
});
```

We want to know that users can win, lose or tie a game with the computer.
For the moment we don't care about errors that could happen from passing
data that could break our code since I want to make this example shorter.

If we run this test we're going to have different results because the CPU is randomly
choosing an option. That's bad for our tests as we don't have something solid to expect.

The module that we are going to _mock_ is _cpu.js_. What we want is to override the `choice`
function. For that, we're going to use the **Monkey-patching** technique. According to
Wikipedia, a _monkey patch_ is a way for a program to extend or modify supporting system
software locally (affecting only the running instance of the program).

_**Caution**: The whole project for the game implies that the code is will be transplied to common js._

Let's do that inside our test:
```js
test("User can win against CPU", expect => {
  cpu.choice = () => {
    return 'scissors'
  };

  const result = game("rock");
  const expected = "You Won";

  expect(result).toBe(expected);
});
```

If we do that with all of our tests, then everything is going to work and we are going to have
all of our tests passing. But having to do this every time is so annoying as we could easily
forget to change the value of the function for new tests, or worst, maybe we need the original
implementation and we need to save it before.
I believe you can imagine how big the problem could be since we need to test more choices.

There is a little cheat in these _mocks_. I'm assuming that the way I'm coding is going to
be transformed into _common js_ modules. In _ES_ modules, this won't be the truth as to
how the resolution is treated. Being said that, a better solution would be to use a _mocking_
framework. Guess what? _JEST_ also has this in their vast tools. The good thing is that
is very easy to use. This time we're going to get rid of our _testing framework_ and
we're going to use **JEST**.

```js
// src/__tests__/game.test.js
import game from "../game.js";
import cpu from "../cpu.js";

jest.mock("../cpu", () => {
  return {
    choice: jest.fn()
  };
});

// We're going to return these choices in sequential order
beforeEach(() => {
  cpu.choice
    .mockReturnValueOnce("rock")
    .mockReturnValueOnce("scissors")
    .mockReturnValueOnce("paper");
});

test("User can win against CPU", () => {
  ["paper", "rock", "scissors"].forEach(option => {
    const result = game(option);
    const expected = "You Won";

    expect(result).toBe(expected);
  });
});

test("User can lose against CPU", () => {
  ["scissors", "paper", "rock"].forEach(option => {
    const result = game(option);
    const expected = "Computer Won";

    expect(result).toBe(expected);
  });
});

test("User can tie against CPU", () => {
  ["rock", "scissors", "paper"].forEach(option => {
    const result = game(option);
    const expected = "Tie";

    expect(result).toBe(expected);
  });
});
```

Notice how our testing framework was very similar to **JEST**. We get rid of it and the only change
we did was that the functions `test` and `expect` are in the global scope.
The thing that in my opinion is not very good but I can understand that importing the framework in
every test can be tired. As you can notice, `jest.mock` will mock the entire module and we can start
changing the implementation to get more cases for our game.
We used `beforeEach` function to mock the choices that the CPU will choice in sequential order,
making us the life easy to create an array of choices for the user
and test that our game implementation is doing the correct implementation.

In the testing world, the _state_ of each _test_ that it's setup or cleared before or after we run
them is called **fixture**. Other examples are when you need to connect to a DB and close the
connection or like our previous example for returning to the initial state.

And that's all for this time. Now that I've set the basics in this post, I would like to add some
techniques on how to make better testing and how we can avoid some problems that could lead you to
hate testing. Keep in mind what you need to test and if there is no other way, mock modules that
are outside of your hand.