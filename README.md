# gulp-contentequals

Allows branching in gulp tasks based on comparisons of two files, useful for testing projects which utilize custom gulp tools. Invokes successCallBack when the contents of the two files are identical, failCallBack when they differ, and will always invoke finalCallback. Any unnecessary callbacks may be null or undefined.

Available via npm: `npm i gulp-contentequals`

## Use:
```
  const contentequals = require("gulp-contentequals");

  gulp.src("./FileToTest")
      .pipe(contentequals("./FileToCheckAgainst", 
        successCallback, 
        failCallback, 
        finalCallback
      ));
```
