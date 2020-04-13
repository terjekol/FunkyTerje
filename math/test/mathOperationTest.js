
QUnit.test("remove node - first in minus", function (assert) {
    const tree = parseMathText('x=1-2');
    const rightSide = tree.content[1];
    removeNode(rightSide.content[0]);
    const newMathText = toString(tree);
    assert.equal(newMathText, 'x=-2');
});

QUnit.test("remove node - second in minus", function (assert) {
    const tree = parseMathText('x=1-2');
    const rightSide = tree.content[1];
    removeNode(rightSide.content[1]);
    const newMathText = toString(tree);
    assert.equal(newMathText, 'x=1');
});
