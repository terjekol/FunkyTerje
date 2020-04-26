QUnit.test("subtract term - x-2=3", function (assert) {
    // []=([0]-([00]x,[01]2),[1]3)
    testSubtractTerm('x-2=3', '01', 'x=3+2', assert);
});

QUnit.test("subtract term - x-2=-3", function (assert) {
    testSubtractTerm('x-2=-3', '1', 'x-2+3=0', assert);
});

function testSubtractTerm(mathText, term, expectedMathText, assert) {
    model = { mathText };
    moveTermToOtherSide(term);
    assert.equal(model.mathText, expectedMathText);
}
