## Running and Testing Go
### Running

There is a script for running this *Go* code: `npm run deploy`, but this is what it is doing:

- Changing directory to `safely-go`
- Running the built in `go run`, which both compiles and starts the program
> `go run` has to include every *Go* file to run every file.

### Testing

Go to any `*_test.go` file and hit `run package test` to run all unit tests or `run file tests` to just run the specific tests in that file. You can also run each individual test right above the function name.