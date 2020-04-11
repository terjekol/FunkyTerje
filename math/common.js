function nodeToPath(node) {
    if (!node.parent) return '';
    const lastChoice = node.parent.content[0] === node ? '0' : '1';
    return nodeToPath(node.parent) + lastChoice;
}

function isLetter(node) {
    return node.value && node.value.length === 1 && node.value >= 'a' && node.value <= 'z';
}

function isNumber(node) {
    return node.value && node.value.filter(c => c < '0' || c > '9').length === 0;
}

function isUnaryMinus(node) {
    return node.operator === '-' && node.content.length === 1;
}

function isTopLevelTerm(node) {
    const isLeaf = node.value != undefined;
    return '+-'.includes(parentOperator(node)) && parentParentOperator(node) === '='
        || parentOperator(node) === '=' && isLeaf;
}

