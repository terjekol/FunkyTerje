QUnit.test("subtract term - x-2=-3", function (assert) {
    const node = parseMathText('x=1/5');
    assert.equal(node.operator, '=');
});