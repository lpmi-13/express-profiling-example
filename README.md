# Express profiling practice

This is a very basic example of profiling a node app, based on https://nodejs.org/en/learn/getting-started/profiling.

## Steps

First, install the node modules via `npm i`. Then run the server with profiling enabled via:

```
NODE_ENV=production node --prof ./bin/www
```

once the server is running, in a separate terminal window, create a new user with `curl "localhost:3000/newUser?username=matt&password=password"`.

Then, once the user is created, we can run apache bench to see how long the `/auth` endpoint takes.

```
ab -k -c 20 -n 250 "http://localhost:3000/auth?username=matt&password=password"
```

You should see the output after the benchmark completes.
