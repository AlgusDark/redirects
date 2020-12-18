---
title: How to test React apps?
bgImage: "./rainy.gif"
description: Writing maintainable tests for the Web.
tags: [javascript, programming]
date: 2019-10-26
draft: true
---

As I `mentioned` in [my previous post about testing](/what-is-and-how-can-we-test-something), there are many
libraries out there that can help us to create our tests that are maintainable and resilient.
Recently I've discovered [Testing Library](https://testing-library.com/), a set of testing utilities
that will encourage us to use good testing practices.  The library is mainly maintained by
[Kent C. Dodds](https://twitter.com/kentcdodds), a developer that I recommend you to follow
as he is always tweeting good content about stuff he is learning or discovering.
He also has a good blog post about "[Why is testing implementation details bad?](https://kentcdodds.com/blog/testing-implementation-details)".

In a few words, **implementation details** are the code of your business logic and testing them could
lead to changes in our test that doesn't affect the interaction of our UI. This is something that happens
too often and is the mere essence of developers to mention that testing is boring because it brakes.
Something interesting about this testing library is that **it gives you the necessary utilities so
you don't have easy paths to use bad practices** for the mere testing purpose.

What we want to test is what the user will use since they don't care about what libraries or algorithms
we're using to make our product, they only care about usability and that's what our tests
should test. Of course, there are places where testing the implementation is a good fit,
but most of the time that code will be used trough our application driven by the user actions.
In the end, what we want to test is that our application is usable and working,
that's why should care in specific stuff as the input and output of our UI to see if it's
usable or not and intended as is.

React testing library is based on the
[DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro),
a very light-weight solution for testing DOM nodes. This is something really cool as we have
a wrapper for querying the output of our React code. There are other wrappers in this test
libraries family, so you can find how to use it in other frameworks/libraries,
but the important thing is that all reside in the UI and how it is used.

Let's use our previous example, the rock-paper-scissors game. Try to use it and you will
start a game with the computer. The player will be able to see what is his choice and the
computer's choice with a counter of how many times he has been playing.

{{< codesandbox src="paper-rock-scissors-bs8d6" height="340px" >}}

To make the code readable, I'll split in different chunks, but they are in the same file.

First is all of our imports, where we are going to reuse some of the modules we already wrote
in my previous post and we are going to use [Emotion](https://emotion.sh/docs/introduction)
so we can use CSS-in-JS:

```js
import React from "react";
import styled from "@emotion/styled";

import paper from "./assets/paper.png";
import rock from "./assets/rock.png";
import scissors from "./assets/scissors.png";

import choices from "./utils/choices";
import cpu from "./utils/cpu";
```

We're going to create two _styled_ components that will wrap our App. **Container** will be our
parent styled component and will just help us to gather all in the center while **Options** will
get the three available options that a player can choose.

```jsx
const Container = styled.div`
  max-width: 450px;
  margin: 0 auto;
  border: 1px solid var(--text);
  padding: 0.2rem;
  text-align: center;

  h5 {
    margin-bottom: 0;
  }
`;

const Options = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .option:not(:last-child) {
    margin-right: 0.5rem;
  }

  img {
    margin-bottom: 0;
  }
`;
```

After that, we need some components to display an option and some text:

```jsx
function Option({ src, alt, onClick }) {
  return (
    <div className="option">
      <img onClick={onClick} src={src} alt={alt} />
    </div>
  );
}

function Match({ p1, p2 }) {
  return <h3>{`${p1} vs ${p2}`}</h3>;
}

function GameOver({ text }) {
  return <h4>{text}</h4>;
}

function Counter({ times }) {
  return (
    <h5 data-testid="counter">
      You've played {times} time{times > 1 && "s"}
    </h5>
  );
}
```

I've changed the code of the `getWinner` function so it's a lot easier to understand. Now we're
using a `Map` instead of an object:

```js
// choices.js
export default new Map([
  ["rock", "scissors"],
  ["scissors", "paper"],
  ["paper", "rock"],
])

// cpu.js
import choices from "./choices"

function choice() {
  return [...choices.keys()][Math.floor(Math.random() * Math.floor(3))]
}

export default { choice }

// This is a lot easier to read and understand
function getWinner(choice1, choice2) {
  if (choice1 === choice2) return 0;
  if (choices.get(choice1) === choice2) return 1;
  return -1;
}
```

Now we are going to have our render function that will use all of the small components we
defined before:

```jsx
export default function App() {
  const [winner, setWinner] = React.useState("");
  const [players, setPlayers] = React.useState(undefined);
  const [playedTimes, setPlayedTimes] = React.useState(0);

  function game(user) {
    setPlayedTimes(playedTimes + 1);

    const CPU = cpu.choice();

    setPlayers({
      p1: user,
      p2: CPU
    });

    const winner = getWinner(user, CPU);

    if (winner < 0) {
      return setWinner("Computer Won");
    } else if (winner > 0) {
      return setWinner("You Won");
    }
    return setWinner("Tie");
  }

  return (
    <Container>
      <h3>Choose your weapon:</h3>
      <Options>
        <Option
          onClick={() => game("paper")}
          src={paper}
          alt="Hand with a paper shape"
        />
        <Option
          onClick={() => game("rock")}
          src={rock}
          alt="Hand with a rock shape"
        />
        <Option
          onClick={() => game("scissors")}
          src={scissors}
          alt="Hand with a scissors shape"
        />
      </Options>
      {players && <Match {...players} />}
      {winner && <GameOver text={winner} />}
      {playedTimes > 0 && <Counter times={playedTimes} />}
    </Container>
  );
}
```

Let's install React testing library and
[jest-dom](https://testing-library.com/docs/react-testing-library/intro) to make our assertions
more idiomatic:
```sh
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

So, let's start with our tests. Firstly I want to ensure that we're rendering everything correctly:

```jsx
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

import Game from "../Game"; // This is our App

test("It renders the game", () => {
  const { getByText, getByAltText } = render(<Game />);
  getByText(/choose your weapon/i);
  getByAltText(/rock/i);
  getByAltText(/paper/i);
  getByAltText(/scissors/i);
});
```

If we run that test, it will pass. Something strange is that we haven't use the `expect` function, but actually
we're expecting something to happen. First, the `render` function will give us access to some utilities
known as [Queries](https://testing-library.com/docs/dom-testing-library/api-queries),
something very similar to what we use for querying dom nodes, and basically is what we're doing
here. If we try to `getBy` _something_ that doesn't exist at the moment of querying, then our test will
complain.

```js
getByText(/doge/i)

/*
Unable to find an element with the text: /doge/i.
This could be because the text is broken up by
multiple elements. In this case, you can provide
a function for your text matcher to make your
matcher more flexible.
*/
```

We can also `debug` our rendered UI so we can check the code that is supposed to be there.
```jsx
const { debug } = render(<Game />);
debug() // Will output all the HTML inside a body and a container
```

And, if necessary, you could also pass a queried dom to debug:
```jsx
const { debug } = render(<Game />);
const title = getByText(/choose your weapon/i);
debug(title)

/* debug:
<h3> Choose your weapon: </h3>
*/
```

Another way to query our dom is to have something that we can be sure is going to be in the attribute
of the DOM node. I don't want to use _class names_ as it could change very quickly because of many reasons.
In the documentation, there are a bunch of ways of doing this querying the node you need to test.
For example, this can be done by searching for _labels_ or _placeholders_, very good for forms. 
This time we will use `data-test-id` in our code and we will use the `getByTestId` query API
to grab the node and make an assertion.

```jsx
// game.js
<...>
  <h3 data-testid="title">Choose your weapon:</h3>
<...>

// game.test.js
test("It renders the game", () => {
 const { getByTestId } = render(<Game />);
 const title = getByTestId('title');
 expect(title).toHaveTextContent(/choose your weapon/i)
});
```

In our previous test we used
[toHaveTextContent](https://github.com/testing-library/jest-dom#tohavetextcontent),
an assertion function part of _jest-dom_. You can check their repo to check other assertions.

As I mentioned before, _react-testing-library_ uses a _body_ DOM element and a _div_ to wrap
our component. If we have multiple tests then we will _mount_ several times in our `document.body`
so we need to have a way to unmount them. There are several ways of doing this:

```js
test("It renders the game", () => {
  const { debug, unmount } = render(<Game />);
  /*
  <body>
    <div>
      <Game/> 
    </div>
  </body>
  */
  unmount()
  // <body><div/></body>
});
```

`unmount` function helps us to unmount the component after we finish the test. But this is something
that can be very tedious to do in every single test that we are going to write. Luckily, react testing library
exposes a `cleanup` method that we can use with _Jest_ to run after each of our tests:

```js
import {render, cleanup} from 'react-testing-library'

afterEach(cleanup)
```

To make things even easier, we can use `'react-testing-library/cleanup-after-each'`, we just need
to import it and that will handle the unmounting fo ourselves.

Now, another thing that we want to test is the interaction. One interaction that I have in
mind for this test is that we can pick a choice and, after that, we can check a how many times
we've played. In order to do that, let's _query_ one option and click it. For that, we're going to use
the _fireEvent_ method:

```js {linenos=table}
test("Choosing a weapon shows status", () => {
  const { getByAltText, getByTestId, queryByTestId } = render(
    <Game />
  );

  const paperOption = getByAltText(/paper/);

  expect(queryByTestId("counter")).toBeNull();

  fireEvent.click(paperOption);

  expect(getByTestId("counter")).toHaveTextContent(/played 1/);

  fireEvent.click(paperOption);

  expect(getByTestId("counter")).toHaveTextContent(/played 2/);
});
```

At line 8 we are using the `queryBy` function so we can check that there is nothing showed as
our logic indicates that there isn't a message in our app since we haven't started a game.
At line 10 we use the
[fireEvent.click](https://github.com/testing-library/dom-testing-library/blob/master/src/events.js)
method on the `paperOption`. According to our business logic, we need to display a piece of information
with how many times we've played.

I don't know you, but this is super amazing. One of the coolest things about testing this way is that we
are checking that our app is usable by the user. If you've ever tested a React application with
Enzyme, you will be faced with a long list of methods to choose from and two types of rendering ways.
_React testing tool_ makes us really difficult to test in a way that maybe the user never will use our app.
For example, there are some tests in the wild that check for the `click` function of one application,
but they don't test that there is a way to access it. That's bad as the test is saying that the _click_
the function does what you want, but there is no way to access it from your app, so is pointless.

There is another utility that I didn't check and is when your application is asynchronous. For that
we have 
[async](https://testing-library.com/docs/dom-testing-library/api-async)  methods you can use.
For example, let's imagine that you have a _loader_ that will disappear once you finish an async
call. First, you will need to _mock_ that behaviour with, probably, a _Promise.resolve()_ in your code.
After that, it's going to be really simple to `wait` 

```js
// A form that was already filled...
const submitButton = /* queried submit button */
fireEvent.click(submitButton);

// we will wait and check if we get confirmation test
// once we click the submitButton 
await wait(() => getByText('Form was sent successfully!'))
```

My recommendation is that, if you're working with UI testing, then try the family in
[testing library](https://testing-library.com/docs/intro). In conjunction with Jest, they are very powerful
companions and will make your test a lot better. I can assure you that you will start seeing all the
benefits in your tests and will have joy in writing them as I started to.