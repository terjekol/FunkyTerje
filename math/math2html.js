function createMenuHtml(options) {
    return Object.keys(options).map(f => `
        <button onclick="selectMath('${f}')">${getIcon(f)}</button>
    `).join('');
}

function getIcon(f) {
    return model.mathOperations[f].icon
        .replace(/\n/g, '<br/>')
        .replace(/ /g, '&nbsp;');
}

function createMathText(mathText, highlight) {
    console.log(highlight);
    const tree = parseMathText(mathText);
    return createHtml(tree, highlight);
}

function createHtml(node, highlight, showOperator) {
    const isLeaf = node.value != undefined;
    const isActive = getIsActive(highlight, node);
    const cssClass = isActive ? 'highlight' : '';
    const onclick = isActive ? `onclick="doMath('${nodeToPath(node)}')"` : '';
    const operatorHtml = showOperator ? `<div>${node.parent.operator.trim()}</div>` : '';
    const includeOperatorInSameHtml = node.operator !== '=';
    const contentHtml = isLeaf ? `<div>${node.value.trim()}</div>` : createNodeHtml(node, highlight);
    // return `${operatorHtml}<div class="${cssClass}">${contentHtml}</div>`;
    return includeOperatorInSameHtml
        ? `<div class="flex ${cssClass}" ${onclick}>${operatorHtml}${contentHtml}</div>`
        : `${operatorHtml}<div class="flex ${cssClass}" ${onclick}>${contentHtml}</div>`
}

function nodeToPath(node) {
    if (!node.parent) return '';
    const lastChoice = node.parent.content[0] === node ? '0' : '1';
    return nodeToPath(node.parent) + lastChoice;
}

function nodeToString(node) {
    const isLeaf = node.value != undefined;
    if (isLeaf) {
        const sign = parentOperator(node) === '-' && node == node.parent.content[1] ? '-' : '';
        return sign + node.value;
    }
    if (node.content.length === 1) return node.operator + nodeToString(node.content[0]);
    return nodeToString(node.content[0]) + node.operator + nodeToString(node.content[1]);
}

function getIsActive(highlight, node) {
    return highlight === 'selectOneTerm' && isTerm(node)
        || highlight === 'selectFactor' && isFactor(node)
        || highlight === 'selectFactorInNumerator' && isNumerator(node)
        || highlight === 'selectFactorInDenominator' && isDenominator(node);
}

function isTerm(node) {
    const isLeaf = node.value != undefined;
    return '+-'.includes(parentOperator(node)) && parentParentOperator(node) === '='
        || parentOperator(node) === '=' && isLeaf;
}

function isFactor() {
    return false;
}

function isNumerator() {
    return false;
}

function isDenominator() {
    return false;
}

function createNodeHtml(node, highlight) {
    const op = node.operator.trim();
    if (op === '/') return `
        <div class="flex vertical">
            ${createHtml(node.content[0], highlight)}
            <div class="fraction">&nbsp;</div>
            ${createHtml(node.content[1], highlight)}
        </div>
        `;
    if (node.content.length == 2) return `
        <div class="flex">
            ${createHtml(node.content[0], highlight)}            
            ${createHtml(node.content[1], highlight, true)}
        </div>
        `;
    if (op === '-' && node.content.length === 1) return `
        <div class="flex">
            <div>-</div>
            ${createHtml(node.content[0], highlight)}
        </div>
        `;
    console.error('cannot create HTML', node);
}

function parentOperator(node) {
    return node.parent ? node.parent.operator : null;
}

function parentParentOperator(node) {
    return node.parent && node.parent.parent ? node.parent.parent.operator : null;
}