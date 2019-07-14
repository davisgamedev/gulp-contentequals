var gulp = require("gulp");
var contentequals = require("../index");

function log(msg) { return () => console.log(msg); }

gulp.task("test", function(done){
    gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", log("test 1 success"), log("test 1 fail")))
        .pipe(contentequals("./fail.txt", log("test 2 fail"), log("test 2 success")));
    done();
})