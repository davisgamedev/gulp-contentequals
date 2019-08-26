const gulp = require("gulp");
const contentequals = require("../index");

const chai = require("chai");
const sinon = require("sinon");

const should = chai.should();
const expect = chai.expect;


function log(msg) { return () => console.log(msg); }

const noop = ()=>{};
const successCb = noop;
const failCb = noop;

const successSpy = sinon.spy(successCb);
const failSpy = sinon.spy(failCb);

/*
    Okay, we're kind of stuck right now, both gulp and mocha need to run together, but both
    want to be run as a top-level function...
    We could export a test file and use mocha to confirm?
        - I don't think this would be offensive, it's a little overkill but mocha makes tests clearer and it would work
        - could even use gulp-mocha to tidy up the mocha launch
    Running gulp tests from npm would require a "cd" right now, is that okay?
*/

gulp.task("test", function(done){
    
    describe("gulp-contentequals", function(){
        gulp.src("./test.txt")
        .pipe(contentequals("./success.txt", log("test 1 success"), log("test 1 fail")))
        //.pipe(contentequals("./success.txt", successCb, failCb))
        .pipe(contentequals("./fail.txt", log("test 2 fail"), log("test 2 success")))
        //.pipe(contentequals("./fail.txt", successCb, failCb));
        done();
    });
})