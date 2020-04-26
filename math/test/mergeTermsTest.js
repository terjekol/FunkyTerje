// plus
QUnit.test("merge terms - plus + plus", function (assert) {
    testMergeTerms('x=1+2', '10', '11', 'x=3', assert);
});

QUnit.test("merge terms - plus + 1. minus ", function (assert) {
    // =([0]x,-(+([100]1,[101]2),[11]3))
    testMergeTerms('x=1+2-3', '100', '101', 'x=3-3', assert);
});

QUnit.test("merge terms - plus + 2. minus - x=1+2-3", function (assert) {
    // =([0]x,-(+([100]1,[101]2),[11]3))
    testMergeTerms('x=1+2-3', '100', '11', 'x=2-2', assert);
    testMergeTerms('x=7+2-3', '100', '11', 'x=4+2', assert);
    testMergeTerms('x=3+2-3', '100', '11', 'x=2', assert);
});

QUnit.test("merge terms - plus + unary minus ", function (assert) {
    // =([0]x,-(+([100]1,-([1010]2)),[11]3))
    testMergeTerms('x=1+(-2)-3', '100', '101', 'x=-1-3', assert);
    testMergeTerms('x=2+(-2)-3', '100', '101', 'x=-3', assert);
    testMergeTerms('x=3+(-2)-3', '100', '101', 'x=1-3', assert);
});

// 1. minus
QUnit.test("merge terms - 1. minus + plus", function (assert) {
    // =([0]x,+(-([100]1,[101]2),[11]3))
    testMergeTerms('x=1-2+3', '100', '11', 'x=4-2', assert);
});

QUnit.test("merge terms - 1. minus + 1. minus ", function (assert) {
    // =([0]x,-(+(-([1000]1,[1001]2),[101]3),[11]5))
    testMergeTerms('x=1-2+3-5', '1000', '101', 'x=4-2-5', assert);
});

QUnit.test("merge terms - 1. minus + 2. minus ", function (assert) {
    // =([0]x,-(+(-([1000]1,[1001]2),[101]3),[11]5))
    testMergeTerms('x=1-2+3-5', '1000', '11', 'x=-2+3-4', assert);
});

QUnit.test("merge terms - 1. minus + unary minus ", function (assert) {
    // []=([0]x,[1]+([10]-([100]1,[101]2),[11]-([110]3)))
    testMergeTerms('x=1-2+(-3)', '100', '11', 'x=-2+(-2)', assert);
});

// 2. minus
QUnit.test("merge terms - 2. minus + plus", function (assert) {
    // =([0]x,+(-([100]1,[101]2),[11]3))
    testMergeTerms('x=1-2+3', '101', '11', 'x=1+1', assert);
});

QUnit.test("merge terms - 2. minus + 1. minus ", function (assert) {
    // =([0]x,-(+(-([1000]1,[1001]2),[101]3),[11]5))
    testMergeTerms('x=1-2+3-5', '1001', '101', 'x=1+1-5', assert);
});

QUnit.test("merge terms - 2. minus + 2. minus ", function (assert) {
    // =([0]x,-(+(-([1000]1,[1001]2),[101]3),[11]5))
    testMergeTerms('x=1-2+3-5', '1001', '11', 'x=1-7+3', assert);
});

QUnit.test("merge terms - 2. minus + unary minus ", function (assert) {
    // []=([0]x,[1]+([10]+([100]-([1000]1,[1001]2),[101]3),[11]-([110]5)))
    testMergeTerms('x=1-2+3+(-5)', '1001', '11', 'x=1-7+3', assert);
});

// unary minus
QUnit.test("merge terms - unary minus + plus", function (assert) {
    // []=([0]x,[1]+([10]-([100]1),[11]7))
    testMergeTerms('x=-1+7', '10', '11', 'x=6', assert);
});

QUnit.test("merge terms - unary minus + 1. minus ", function (assert) {
    // []=([0]x,[1]-([10]+([100]-([1000]1),[101]7),[11]3))
    testMergeTerms('x=-1+7-3', '100', '101', 'x=6-3', assert);
});

QUnit.test("merge terms - unary minus + 2. minus ", function (assert) {
    // []=([0]x,[1]-([10]+([100]-([1000]1),[101]7),[11]3))
    testMergeTerms('x=-1+7-3', '100', '11', 'x=-4+7', assert);
});

QUnit.test("merge terms - unary minus + unary minus ", function (assert) {
    // []=([0]x,[1]-([10]-([100]1),[11]-([110]2)))
    testMergeTerms('x=-1-(-2)', '10', '11', 'x=1', assert);
});

QUnit.test("merge x-terms - x=2*x+3*x ", function (assert) {
    // []=([0]x,[1]+([10]*([100]2,[101]x),[11]*([110]3,[111]x)))
    testMergeTerms('x=2*x+3*x', '10', '11', 'x=5*x', assert);
});

QUnit.test("merge x-terms - x=5*x-3*x ", function (assert) {
    // []=([0]x,[1]+([10]*([100]2,[101]x),[11]*([110]3,[111]x)))
    testMergeTerms('x=5*x-3*x', '10', '11', 'x=2*x', assert);
});

QUnit.test("merge x-terms - x=3*x-5*x ", function (assert) {
    // []=([0]x,[1]+([10]*([100]2,[101]x),[11]*([110]3,[111]x)))
    testMergeTerms('x=3*x-5*x', '10', '11', 'x=-2*x', assert);
});

QUnit.test("merge x-terms - x=-3*x+5*x ", function (assert) {
    // []=([0]x,[1]+([10]*([100]-([1000]3),[101]x),[11]*([110]5,[111]x)))
    testMergeTerms('x=-3*x+5*x', '10', '11', 'x=2*x', assert);
});

QUnit.test("merge x-terms - x=-3*x+(-5*x)", function (assert) {
    // []=([0]x,[1]+([10]*([100]-([1000]3),[101]x),[11]*([110]-([1100]5),[111]x)))
    testMergeTerms('x=-3*x+(-5*x)', '10', '11', 'x=-8*x', assert);
});

QUnit.test("merge x-terms - x=-3*x+(-(5*x))", function (assert) {
    // []=([0]x,[1]+([10]*([100]-([1000]3),[101]x),[11]-([110]*([1100]5,[1101]x))))
    testMergeTerms('x=-3*x+(-(5*x))', '10', '11', 'x=-8*x', assert);
});

QUnit.test("merge x-terms - x=-3*x+(-(5*x))", function (assert) {
    // []=([0]x,[1]+([10]*([100]-([1000]3),[101]x),[11]-([110]*([1100]5,[1101]x))))
    testMergeTerms('x=-3*x+(-(5*x))', '10', '110', 'x=-8*x', assert);
});

QUnit.test("merge x-terms - x=x+x", function (assert) {
    // []=([0]x,[1]+([10]x,[11]x))
    testMergeTerms('x=x+x', '10', '11', 'x=2*x', assert);
});

QUnit.test("merge x-terms - x=2*x+x", function (assert) {
    // []=([0]x,[1]+([10]*([100]2,[101]x),[11]x))
    testMergeTerms('x=2*x+x', '10', '11', 'x=3*x', assert);
});

QUnit.test("merge x-terms - x=x+2*x", function (assert) {
    // []=([0]x,[1]+([10]*([100]2,[101]x),[11]x))
    testMergeTerms('x=2*x+x', '10', '11', 'x=3*x', assert);
});

QUnit.test("merge x-terms - x=x-2*x", function (assert) {
    // []=([0]x,[1]-([10]x,[11]*([110]2,[111]x)))
    testMergeTerms('x=x-2*x', '10', '11', 'x=-x', assert);
});

QUnit.test("merge x-terms - x=-x-2*x", function (assert) {
    // []=([0]x,[1]-([10]x,[11]*([110]2,[111]x)))
    testMergeTerms('x=-x-2*x', '10', '11', 'x=-3*x', assert);
});

QUnit.test("merge x-terms - x=a*b+2*a*b", function (assert) {
    // []=([0]x,[1]+([10]*([100]a,[101]b),[11]*([110]*([1100]2,[1101]a),[111]b)))"
    testMergeTerms('x=a*b+2*a*b', '10', '11', 'x=3*a*b', assert);
});

QUnit.test("merge x-terms - x=a*b+2*a*b", function (assert) {
    testMergeTerms('x=2*a*b-a*b', '10', '11', 'x=a*b', assert);
});

QUnit.test("merge x-terms - x=3*a*b+2*a*b", function (assert) {
    testMergeTerms('x=3*a*b+2*a*b', '10', '11', 'x=5*a*b', assert);
});


function testMergeTerms(mathText, term1, term2, expectedMathText, assert) {
    model = { mathText };
    mergeTerms(term1, term2);
    assert.equal(model.mathText, expectedMathText);
}
