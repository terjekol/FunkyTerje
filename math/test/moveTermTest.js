QUnit.test("move term - 2*x-6*x=0", function (assert) {
    // []=([0]-([00]*([000]2,[001]x),[01]*([010]6,[011]x)),[1]0)
    testMoveTerm('2*x-6*x=0', '01', '2*x=6*x', assert);
});

QUnit.test("move term - -5*x+3=6-6*x", function (assert) {
    // []=([0]+([00]*([000]-([0000]5),[001]x),[01]3),[1]-([10]6,[11]*([110]6,[111]x)))"
    testMoveTerm('-5*x+3=6-6*x', '11', '-5*x+3+6*x=6', assert);
});


QUnit.test("move term - 0=-6*x-2", function (assert) {
    // []=([0]0,[1]-([10]*([100]-([1000]6),[101]x),[11]2))
    testMoveTerm('0=-6*x-2', '10', '-5*x+3+6*x=-2', assert);
});

QUnit.test("doSimplifications", function (assert) {
    const node = parseMathText('2*x-0=0+6*x');
    while(doSimplifications(node));
    const text = toString(node);
    assert.equal(text, '2*x=6*x');
    // []=([0]*([00]2,[01]x),[1]*([10]6,[11]x))
    // []=([0]-([00]*([000]2,[001]x),[01]0),[1]+([]0,[]*([]6,[]x)))
    // "2*x-0=0+6*x"
});

function testMoveTerm(mathText, term, expectedMathText, assert) {
    model = { mathText };
    moveTermToOtherSide(term);
    assert.equal(model.mathText, expectedMathText);
}
