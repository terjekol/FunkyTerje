function nodeToPath(node) {
    if (!node.parent) return '';
    const lastChoice = node.parent.content[0] === node ? '0' : '1';
    return nodeToPath(node.parent) + lastChoice;
}

function isLetter(node) {
    return node.value && node.value.length === 1 && node.value >= 'a' && node.value <= 'z';
}

function isNumber(node) {
    return node.value && node.value.split('').filter(c => c < '0' || c > '9').length === 0;
}

function isUnaryMinus(node) {
    return node.operator === '-' && node.content.length === 1;
}

function isTopLevelTerm(node) {
    if ('=+-'.includes(node.operator) && node.content.length === 2) return false;
    return firstParentOperatorOtherThan('+-', node) === '=';
}

function firstParentOperatorOtherThan(operators, node) {
    return operators.includes(node.parent.operator)
        ? firstParentOperatorOtherThan(operators, node.parent)
        : node.parent.operator;
}

function createConstantNode(constant) {
    const node = { value: '' + Math.abs(constant) };
    return constant < 0 ? makeNode('-', [node]) : node;
}

