
# parallel

  A simple API for running async functions in parallel.

## Installation

    $ component install ianstormtaylor/parallel
    $ npm install ianstormtaylor/parallel

## Example
  
```js
var parallel = require('parallel');

function getOwner (id, callback) {
  parallel()
    .add(users.get)
    .add(organizations.get)
    .run(id, function (err, results) {
      if (err) return callback(err);
      callback(results[0] || results[1]);
    });
}
```

## API

### #add(fn, [args...])

  Add a `fn` to be called in parallel. Optionally add `args...` specific to the function.

### #bind(context)

  Pass a `context` for all of the functions to be bound with.

### #run([args...], callback)

  Run the functions in parallel and `callback`. Optionally pass in `args...` to be passed to all the functions.

## License

  MIT
