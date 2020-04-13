
QUnit.test("extract positive constant x=1+2", function (assert) {
    // =([0]x,+([10]1,[11]2))
    const tree = parseMathText('x=1+2');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '2');
    assert.equal(extraction.theRest, null);
});

QUnit.test("extract negative constant", function (assert) {
    // =([0]x,-([10]1,[11]2))
    const tree = parseMathText('x=1-2');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-2');
    assert.equal(extraction.theRest, null);
});

QUnit.test("extract negative unary constant", function (assert) {
    // []=([0]x,[1]+([10]1,[11]-([110]2)))
    const tree = parseMathText('x=1+(-2)');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-2');
    assert.equal(extraction.theRest, null);
});

QUnit.test("extract negative unary product", function (assert) {
    // []=([0]x,[1]+([10]1,[11]*([110]-([1100]2),[111]3)))
    const tree = parseMathText('x=1+(-2*3)');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-2');
    assert.equal(toString(extraction.theRest), '3');
});


QUnit.test("extract negative unary product - 2", function (assert) {
    // []=([0]x,[1]+([10]1,[11]-([110]*([1100]2,[1101]3))))
    const tree = parseMathText('x=1+(-(2*3))');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-2');
    assert.equal(toString(extraction.theRest), '3');
});

QUnit.test("extract negative unary product - 3", function (assert) {
    // []=([0]x,[1]+([10]1,[11]-([110]*([1100]2,[1101]3))))
    const tree = parseMathText('x=1+(-(x*3))');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-3');
    assert.equal(toString(extraction.theRest), 'x');
});

QUnit.test("extract  product", function (assert) {
    // []=([0]x,[1]+([10]1,[11]*([110]2,[111]3)))
    const tree = parseMathText('x=1+2*3');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '2');
    assert.equal(toString(extraction.theRest), '3');
});

QUnit.test("extract constant in x-term", function (assert) {
    // []=([0]x,[1]+([10]1,[11]*([110]2,[111]x)))
    const tree = parseMathText('x=1+2*x');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '2');
    assert.equal(extraction.theRest.value, 'x');
});

QUnit.test("extract negative constant in x-term", function (assert) {
    // []=([0]x,[1]-([10]1,[11]*([110]2,[111]x)))
    const tree = parseMathText('x=1-2*x');
    const node = nodeFromIndexes('11', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-2');
    assert.equal(extraction.theRest.value, 'x');
});

QUnit.test("extract unary minus constant in x-term", function (assert) {
    // []=([0]x,[1]+([10]*([100]-([1000]3),[101]x),[11]*([110]5,[111]x)))
    const tree = parseMathText('x=-3*x+5*x');
    const node = nodeFromIndexes('10', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '-3');
    assert.equal(extraction.theRest.value, 'x');
});

QUnit.test("extract 1. in minus", function (assert) {
    // []=([0]x,[1]-([10]1,[11]2))
    const tree = parseMathText('x=1-2');
    const node = nodeFromIndexes('10', tree);
    const extraction = extractConstant(node);
    assert.equal(extraction.constant, '1');
    assert.equal(extraction.theRest, null);
});
