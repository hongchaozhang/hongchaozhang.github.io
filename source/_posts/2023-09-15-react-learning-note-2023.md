---
layout: post
title: "React Learning Note 2023"
date: 2023-09-15 17:33:08 +0800
comments: true
categories: [web, react]
---


<!-- more -->

- [React state is updated in a “batch”](#react-state-is-updated-in-a-batch)
- [Update react state with a new object, do not mute existing one](#update-react-state-with-a-new-object-do-not-mute-existing-one)
- [Declarative UI](#declarative-ui)
- [React-redux](#react-redux)
- [Hooks](#hooks)
- [React中的变量](#react中的变量)
- [useEffect](#useeffect)
  - [clean up function](#clean-up-function)
- [useMemo](#usememo)
- [two ways to store previous props](#two-ways-to-store-previous-props)
  - [useRef](#useref)
  - [useState](#usestate)
- [fetch data的两个问题](#fetch-data的两个问题)
  - [race condition](#race-condition)
  - [undo](#undo)
- [Effect Event](#effect-event)
  - [what is reactive](#what-is-reactive)
  - [Problem](#problem)
  - [Solution:](#solution)
  - [Supress react lint error](#supress-react-lint-error)
- [How to review effect dependencies](#how-to-review-effect-dependencies)
  - [ways to review and fix this](#ways-to-review-and-fix-this)
- [Object and function compare](#object-and-function-compare)
- [useMemo and useCallback](#usememo-and-usecallback)
- [forwardRef](#forwardref)
  - [useRef](#useref-1)
  - [basic concepts](#basic-concepts)
  - [expose dom node](#expose-dom-node)
  - [expose an object](#expose-an-object)
- [Custom Hook](#custom-hook)
- [strict mode](#strict-mode)
- [Other Rules](#other-rules)
  - [data from parent to child](#data-from-parent-to-child)
  - [useSyncExternalStore](#usesyncexternalstore)
  - [useEffect dependencies](#useeffect-dependencies)



## React state is updated in a “batch”
This means that you can not get the state immediately after you change it.

number will be 1 after one click:
```
export default function Counter() {
  const [number, setNumber] = useState(0);
  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```
To make the number to be 3, pass a update function to the setNumber function. An update function will be queued and executed later.
```
export default function Counter() {
  const [number, setNumber] = useState(0);
  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```
## Update react state with a new object, do not mute existing one

Use `…` , the object spread operator:
```
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```
Note that spread syntax is shallow: it only copies one level deep. To update nested object:
```
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```
For updating array object:
```
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```
`Immer` is a popular library that lets you write using the convenient but mutating syntax and takes care of producing the copies for you.
```
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```
Using `Immer` for array:
```
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```
## Declarative UI

* Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).
* When developing a component, Think in declarative UI way:
    1. Identify all its visual states.
    2. Determine the human and computer triggers for state changes.
    3. Model the state with useState.
    4. Remove non-essential state to avoid bugs and paradoxes.
    5. Connect the event handlers to set state.


## React-redux
* useReducer+useContext?
* Provider
* Context

## Hooks
* useContext: 跨层传输props，不用一层一层传下去
* useEffect: Use them to synchronize your component with a system outside of React.

## React中的变量
- Props：immutable, 触发rerender，不记忆(retained by component)
- State：immutable, 触发rerender，记忆(retained by React)
- useRef：mutable, 不触发rerender，记忆(retained by React)

## useEffect
Effects let you specify side effects that are caused by rendering itself, rather than by a particular event. 

Effects run at the end of a *commit* after the screen updates. That is, useEffect “delays” a piece of code from running until that render is reflected on the screen.

### clean up function
You can use a clean up function to clean up the effect. For example, if you subscribe to an external data source, you can unsubscribe it in the clean up function.
```
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  return () => {
    connection.disconnect();
  };
}, []);

useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```
**React will call your cleanup function each time before the next Effect runs again, and one final time when the component unmounts (gets removed).**
That is, the cleanup function runs not only during unmount, but before every re-render with changed dependencies. 

## useMemo

useMemo和useEffect都可以加依赖，但是useMemo在render过程起作用，而useEffect在commit之后起作用。
所以，如果是render依赖的变量值，用useMemo，不用useEffect+useState。

不推荐：
```
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);
  // ...
}
```
推荐：
```
import { useMemo, useState } from 'react';
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```
## two ways to store previous props
### useRef
`prevProps` updates after render:
```
  const prevProps = useRef();
  useEffect(() => {
    prevProps.current = props;
  }, [props]);
```
### useState
`prevItems` is ready when render:
```
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
  }
```
## fetch data的两个问题
### race condition
输入特别快的时候，很多search的request连续发出，不能保证回来的顺序，会出问题。
解决方法：给useEffect提供cleanup函数解决
```
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```
### undo
没看懂：https://react.dev/learn/you-might-not-need-an-effect#fetching-data

## Effect Event
### what is reactive
variables which can change due to a re-render
* Logic inside event handlers (or Effect Event) is not reactive.
* Logic inside Effects is reactive.

### Problem
```
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```
When reconnected, a notification will be shown, and the notificaiton will consider the theme.
But when the theme changes, the notification will also be shown, which is not expected.

### Solution:
Use Effect Event to separate this non-reactive logic from the reactive Effect around it.
```
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

You can think of Effect Events as being very similar to event handlers. The main difference is that event handlers run in response to a user interactions, whereas Effect Events are triggered by you from Effects. Effect Events let you “break the chain” between the reactivity of Effects and code that should not be reactive.

### Supress react lint error
React linter ask you to add all reactive variables into the Effect dependencies.
Effect Events let you fix many patterns where you might be tempted to suppress the dependency linter.

## How to review effect dependencies
Every time you adjust the Effect’s dependencies to reflect the code, look at the dependency list. Does it make sense for the Effect to re-run when any of these dependencies change? Sometimes, the answer is “no”:

- You might want to re-execute different parts of your Effect under different conditions.
- You might want to only read the latest value of some dependency instead of “reacting” to its changes.
- A dependency may change too often unintentionally because it’s an object or a function.

### ways to review and fix this
* Should this code move to an event handler? 
* Is your Effect doing several unrelated things? 
    * If different parts of your Effect should re-run for different reasons, split it into several Effects.
* Are you reading some state to calculate the next state? 
    * Use update function. Use `setMessages([...messages, receivedMessage])` instead of `setMessages(msgs => [...msgs, receivedMessage])`
* In JavaScript, objects and functions are considered different if they were created at different times.
* Try to avoid object and function dependencies. Move them outside the component or inside the Effect.
    * Move static objects and functions outside your component 
```
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```
    * Move dynamic objects and functions inside your Effect 
```
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```
* Read primitive values from objects 
```
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```


## Object and function compare
```
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
In the example above, the input only updates the message state variable. From the user’s perspective, this should not affect the chat connection. However, every time you update the message, your component re-renders. When your component re-renders, the code inside of it runs again from scratch.

A new options object is created from scratch on every re-render of the ChatRoom component. React sees that the options object is a different object from the options object created during the last render. This is why it re-synchronizes your Effect (which depends on options), and the chat re-connects as you type.

This problem only affects objects and functions. In JavaScript, each newly created object and function is considered distinct from all the others. It doesn’t matter that the contents inside of them may be the same!

Object and function dependencies can make your Effect re-synchronize more often than you need.

This is why, whenever possible, you should try to avoid objects and functions as your Effect’s dependencies. Instead, try moving them outside the component, inside the Effect, or extracting primitive values out of them.

## useMemo and useCallback
- useMemo caches the result of calling your function. 
- useCallback caches the function itself. React will not call your function.

## forwardRef

First, get familar with `useRef`:
### useRef
ref.current is set during the *commit* process, not *render* process, so do not read or write ref.current during rendering. We can use ref.current in event handler or useEffect.

### basic concepts
```
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```
The ref attribute passed by the parent component. The ref can be an object or a function. You should either
* pass the ref you receive to another component, or
* pass it to useImperativeHandle.

### expose dom node
The parent `Form` component accesses the \<input\> DOM node exposed by `MyInput`.
```
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### expose an object
Use `useImperativeHandle` to expose an object referenced by `ref`:
```
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```


## Custom Hook

You must follow these naming conventions:

- React component names must start with a capital letter, like StatusBar and SaveButton. React components also need to return something that React knows how to display, like a piece of JSX.
- Hook names must start with use followed by a capital letter, like useState (built-in) or useOnlineStatus (custom, like earlier on the page). Hooks may return arbitrary values.

This convention guarantees that you can always look at a component and know where its state, Effects, and other React features might “hide”. For example, if you see a getColor() function call inside your component, you can be sure that it can’t possibly contain React state inside because its name doesn’t start with use. However, a function call like useOnlineStatus() will most likely contain calls to other Hooks inside!

If your linter is configured for React, it will enforce this naming convention. 

Note that custom Hooks only share stateful logic, not state itself.

## strict mode
<StrictMode> lets you find common bugs in your components early during development.

Strict Mode enables the following development-only behaviors:
* Your components will re-render an extra time to find bugs caused by impure rendering.
* Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
* Your components will be checked for usage of deprecated APIs.

## Other Rules
### data from parent to child
When child components update the state of their parent components in Effects, the data flow becomes very difficult to trace. Since both the child and the parent need the same data, let the parent component fetch that data, and pass it down to the child.
This is simpler and keeps the data flow predictable: the data flows down from the parent to the child.
### useSyncExternalStore
### useEffect dependencies
All variables from the component body used by the Effect should be in the Effect dependency list. However, you could instead “prove” to the linter that these values aren’t reactive values, i.e. that they can’t change as a result of a re-render. For example, if serverUrl and roomId don’t depend on rendering and always have the same values, you can move them outside the component. Now they don’t need to be dependencies:
```
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```


