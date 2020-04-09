function createMenuHtml(options) {
    return Object.keys(options).map(f => `
        <button onclick="doMath('${f}')">${model.mathOperations[f].icon.replace(/\n/g, '<br/>')}</button>
    `).join('');
}

function createMathText(mathText, highlight) {
    console.log(highlight);
    const tree = parseMathText(mathText);
    return createHtml(tree, highlight);
}

function createHtml(node, highlight, showOperator) {
    const isLeaf = node.value != undefined;
    const cssClass = getHighlightCssClass(highlight, node);
    let html = isLeaf ? node.value.trim() : createNodeHtml(node, highlight);
    html = `<div class="${cssClass.main}">${html}</div>`;
    if (showOperator) html = `<div class="${cssClass.op}">${node.parent.operator.trim()}</div>` + html;
    return html;
}

function getHighlightCssClass(highlight, node) {
    const useHighlight = highlight === 'selectOneTerm' && isTerm(node)
        || highlight === 'selectFactor' && isFactor(node)
        || highlight === 'selectFactorInNumerator' && isNumerator(node)
        || highlight === 'selectFactorInDenominator' && isDenominator(node);
    const highlightCss = useHighlight ? 'highlight' : '';
    return { main: highlightCss, op: parentOperator(node) === '=' ? '' : highlightCss };
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