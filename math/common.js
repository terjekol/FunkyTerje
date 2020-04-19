function indexesFromNode(node) {
    if (!node.parent) return '';
    const lastChoice = node.parent.content[0] === node ? '0' : '1';
    return indexesFromNode(node.parent) + lastChoice;
}

function nodeFromIndexes(indexes, tree) {
    let node = tree;
    for (let index of indexes) {
        node = node.content[index];
    }
    return node;
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

function isMultiplication(node) {
    return node.operator === '*';
}

function isDivision(node) {
    return node.operator === '/';
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

function parentOperator(node) {
    return node.parent ? node.parent.operator : null;
}

function parentParentOperator(node) {
    return node.parent && node.parent.parent ? node.parent.parent.operator : null;
}

function treeAsText(node) {
    const txt = node.value !== undefined
        ? node.value
        : node.operator + '(' + node.content.map(c => treeAsText(c)).join() + ')';
    return '[' + indexesFromNode(node) + ']' + txt;
}

function range(min, max){
    const count = max - min;
    return Array.from(Array(count).keys()).map(n=>n+min);
}