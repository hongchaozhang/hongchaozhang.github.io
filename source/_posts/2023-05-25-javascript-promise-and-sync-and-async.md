---
layout: post
title: "Promise以及sync和async"
date: 2023-05-25 21:24:13 +0800
comments: true
categories: [javascript]
---

<!-- more -->


For details, refer to [Promises, async/await](https://javascript.info/async)

## Basic usage
```
let promise = new Promise(function(resolve, reject) {
  let resolved = true;
  if (resolved) {
	setTimeout(() => resolve("done!"), 1000);
  } else {
    setTimeout(() => reject(new Error("Whoops!")), 1000);
  }
});

// resolve runs the first function in .then
promise
.finally(() => alert("Promise ready")) // triggers first
.then(
  result => alert(result), // shows "done!" after 1 second
  error => alert(error) // doesn't run
);
```

As you can see, the value returned by the first promise is passed through `finally` to the next `then`.


## Promise chain

```
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

`then` should be a `async` function, so it can convert any return values to a promise.

## Error handling

```
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
  .catch(error => alert(error.message));
```

The code of a promise executor and promise handlers has an "invisible" `try..catch` around it. If an exception happens, it gets caught and treated as a rejection.

The "invisible" `try..catch` around the executor automatically catches the error and turns it into rejected promise.

More details about the error handling workflow, refers to https://javascript.info/promise-error-handling

## Promise.all

```
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// map every url to the promise of the fetch
let requests = urls.map(url => fetch(url));

// Promise.all waits until all jobs are resolved
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
```

The new promise resolves when all listed promises are resolved, and the array of their results becomes its result.

If any of the promises is rejected, the promise returned by `Promise.all` immediately rejects with that error.

Please note that the order of the resulting array members is the same as in its source promises. Even though the first promise takes the longest time to resolve, it’s still first in the array of results.

## Promisification

Used for changing callback style to promise style.

## async/await
```
async function f() {
  return 1;
}

f().then(alert); // 1
```

`async` ensures that the function returns a promise, and wraps non-promises in it.

```
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)

  alert(result); // "done!"
}

f();
```

The function execution “pauses” at the line (*) and resumes when the promise settles, with result becoming its result. So the code above shows “done!” in one second.

Let’s emphasize: `await` literally suspends the function execution until the promise settles, and then resumes it with the promise result. That doesn’t cost any CPU resources, because the JavaScript engine can do other jobs in the meantime: execute other scripts, handle events, etc.

For details, refer to [macrotask and microtask in event loop](/blog/2023/05/25/event-loop-and-macrotask-and-microtask/)


`Async/Sync` is just a more elegant syntax of getting the promise result than `promise.then`. And, it’s easier to read and write.