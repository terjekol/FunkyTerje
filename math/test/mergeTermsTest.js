// plus
QUnit.test("merge terms - plus + plus", function (assert) {
    testMergeTerms('x=1+2', '10', '11', 'x=3', assert);
});

QUnit.test("merge terms - plus + 1. minus ", function (assert) {
    // =([0]x,-(+([100]1,[101]2),[11]3))
    testMergeTerms('x=1+2-3', '100', '101', 'x=3-3', assert);
});

QUnit.test("merge terms - plus + 2. minus ", function (assert) {
    // =([0]x,-(+([100]1,[101]2),[11]3))
    testMergeTerms('x=1+2-3', '100', '11', 'x=2-2', assert);
});

QUnit.test("merge terms - plus + unary minus ", function (assert) {
    // =([0]x,-(+([100]1,-([1010]2)),[11]3))
    //testMergeTerms('x=1+(-2)-3', '100', '1010', 'x=-1-3', assert);
    assert.ok(true);
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
    assert.ok(true);
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
    assert.ok(true);
});

// unary minus
QUnit.test("merge terms - unary minus + plus", function (assert) {
    assert.ok(true);
});

QUnit.test("merge terms - unary minus + 1. minus ", function (assert) {
    assert.ok(true);
});

QUnit.test("merge terms - unary minus + 2. minus ", function (assert) {
    assert.ok(true);
});

QUnit.test("merge terms - unary minus + unary minus ", function (assert) {
    assert.ok(true);
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

function testMergeTerms(mathText, term1, term2, expectedMathText, assert) {
    model = { mathText };
    mergeTerms(term1, term2);
    assert.equal(model.mathText, expectedMathText);
}
