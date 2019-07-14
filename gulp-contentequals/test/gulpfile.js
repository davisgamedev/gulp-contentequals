var gulp = require("gulp");
var contentequals = require("../index.js");

gulp.task("test", function(done){
    
    test1 = false;
    test2 = false;

    gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", () => {test1 = true;}, () => console.error("test 1 fail")))
        .pipe(contentequals("./fail.txt"), () => console.error("test 2 fail"), () => {test2 = true;})
})