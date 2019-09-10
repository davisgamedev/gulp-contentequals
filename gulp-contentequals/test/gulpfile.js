const gulp = require("gulp");
const logger = require("node-color-log");
const contentequals = require("../index");

// testResult, the result of a single test, reported and reset in reportResetTestResult
var testResult;

// success/fail callbacks, used gulp 'test' to set the testResult via gulp-contentequals callbacks
function successCallback(){ testResult = true; }
function failCallback() { testResult = false; }

// total number of tests preformed in gulp 'test' task
const totalTests = 8;
var completedTests = 0;
const timeout = 1000;
var passed = 0;

// logTestFail/Succeed (called in reportResetTestResult)
// logs the test number and reports the result to the console
function logTestFail(testDesc, message) { 
    logger.color("red")
          .bgColor("white")
          .reverse()
          .log(`gulp-contentequals test "${testDesc}" failed! ${message}`);
}
function logTestSucceed(testDesc){
    passed++;
    // logger.color("green")
    //       .bgColor("black")
    //       .reverse()
    //       .log(`gulp-contentequals test "${testDesc}" passed!`);
}
function checkLogFinalReport() {
    if(completedTests < totalTests) return;
    if(passed === totalTests) 
        logger.color("green")
              .bgColor("white")
              .reverse()
              .log(`gulp-contentequals SUCCESS: ${passed}/${totalTests} passed!`);
    else
        logger.color("red")
              .bgColor("white")
              .reverse()
              .log(`gulp-contentequals FAIL: ${totalTests - passed}/${totalTests} tests failed!`)
}

// checks if testResult is unedfined, then compares value to 'expected', then resets the testResult to undefined
function reportResetTestResult(expected, testDesc, result=testResult){
    if (result == null) logTestFail(testDesc, `testResult is undefined!`);
    else if (result !== expected) logTestFail(testDesc, `Expected: '${expected}' but testResult was '${result}'`);
    else logTestSucceed(testDesc);
    
    testResult = undefined;
    completedTests++;
    checkLogFinalReport();
}

/*
    gulp 'test':
    - set1:
        - compares "./test.txt" to several files, calls corresponding callbacks and reports result in 'final' callback
            - "./success.txt" => contents are equal test should pass
            - "./fail.txt"    => contents are different test should fail
            - "./empty1.txt"  => empty file, contents are different test should fail
    - set2:
        - compares "./empty1.txt" to several files, calls corresponding callbacks and reports result in 'final' callback
            - "./fail.txt"    => contents are different test should fail
            - "./empty2.txt"  => empty file, contents are equal test should pass

*/
gulp.task("set1", function(done){
    gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", successCallback, failCallback, 
                reportResetTestResult.bind({}, true, "1: test.txt == success.txt")))

        .pipe(contentequals("./fail.txt",    successCallback, failCallback, 
                reportResetTestResult.bind({}, false, "2: test.txt != fail.txt")))

        .pipe(contentequals("./empty1.txt",  successCallback, failCallback, 
                reportResetTestResult.bind({}, false, "3: test.txt != empty1.txt")));
    done();
});
gulp.task("set2", function(done){
    gulp.src("./empty1.txt")
        .pipe(contentequals("./fail.txt",    successCallback, failCallback, 
                reportResetTestResult.bind({}, false, "4: empty1.txt != fail.txt")))
        .pipe(contentequals("./empty2.txt",  successCallback, failCallback, 
                reportResetTestResult.bind({}, true,  "5: empty1.txt == empty2.txt")));
    done();
});
gulp.task("set3", function(done){

    gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", successCallback));
    reportResetTestResult(true,  "6: test.txt == success.txt, null callbacks", testResult);

    gulp.src("./test.txt")
        .pipe(contentequals("./fail.txt", null, failCallback));
    reportResetTestResult(false, "7: test.txt != fail.txt, null callbacks");
    
    testResult = "test8";
    gulp.src("./test.txt")
        .pipe(contentequals("./empty1.txt", null, null, 
                reportResetTestResult.bind({}, "test8", "8: test.txt != empty1.txt, finalcb only")));

    testResult = "test9";
    gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", null, failCallback, ()=>{testResult = "check"}));
    reportResetTestResult.bind({}, "check", "8: test.txt == success, no successcb, failcb, check finalcb");

    done();
});

gulp.task("test", gulp.series("set1", "set2", "set3"));