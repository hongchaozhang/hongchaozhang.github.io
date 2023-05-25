let promise = new Promise(function(resolve, reject) {
    let resolved = false;
    if (resolved) {
      setTimeout(() => resolve("done!"), 1000);
    } else {
      setTimeout(() => reject(new Error("Whoops!")), 1000);
    }
  });
  
  // resolve runs the first function in .then
  promise
  .finally(() => console.log("Promise ready")) // triggers first
  .then(
    result => console.log(result), // shows "done!" after 1 second
    error => console.log(error) // doesn't run
  );