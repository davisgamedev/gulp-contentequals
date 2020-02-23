# gulp-contentequals

Allows branching in gulp tasks based on comparisons of two files, useful for testing projects which utilize custom gulp tools.
Available on npm: `npm i gulp-contentequals`

## Syntax:
```
  gulp.src("./FileToTest")
      .pipe(contentequals("./FileToCheckAgainst", 
        successCallback, 
        failCallback, 
        finalCallback
      ));
```
