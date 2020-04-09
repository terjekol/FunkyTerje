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

function createHtml(node, highlight, parentOperator, showOperator) {
    const isLeaf = node.value != undefined;
    const cssClass = getHighlightCssClass(highlight, node, parentOperator);
    let html = isLeaf ? `<div class="${cssClass.main}">${node.value.trim()}</div>` : createNodeHtml(node, highlight);
    if (showOperator) html = `<div class="${cssClass.op}">${parentOperator.trim()}</div>` + html;
    return html;
}

function getHighlightCssClass(highlight, node, parentOperator) {
    const useHighlight = highlight === 'selectOneTerm' && isTerm(node, parentOperator)
        || highlight === 'selectFactor' && isFactor(node, parentOperator)
        || highlight === 'selectFactorInNumerator' && isNumerator(node, parentOperator)
        || highlight === 'selectFactorInDenominator' && isDenominator(node, parentOperator);
    const highlightCss = useHighlight ? 'highlight' : '';
    return { main: highlightCss, op: parentOperator === '=' ? '' : highlightCss };
}
function isTerm(node, operator) {
    if (operator !== '=' && node.parent && node.parent.operator !== '=') return false;
    const isLeaf = node.value != undefined;
    return '+-'.includes(operator) || operator === '=' && isLeaf;
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
            ${createHtml(node.content[0], highlight, op)}
            <div class="fraction">&nbsp;</div>
            ${createHtml(node.content[1], highlight, op)}
        </div>
        `;
    if (node.content.length == 2) return `
        <div class="flex">
            ${createHtml(node.content[0], highlight, op)}            
            ${createHtml(node.content[1], highlight, op, true)}
        </div>
        `;
    // if (node.content.length > 1 && '+-'.includes(node.operator)) {
    //     const shouldHighlight = highlight === 'selectOneTerm';
    //     const wrapStart = shouldHighlight ? '<div class="highlight">' : '';
    //     const wrapEnd = shouldHighlight ? '</div>' : '';
    //     return `
    //     <div class="flex">
    //         ${node.content.map(n => wrapStart + createHtml(n, highlight) + wrapEnd)
    //             .join(`<div>${node.operator.trim()}</div>`)}
    //     </div>
    //     `;
    // }
    // if (node.content.length > 1) return `
    //     <div class="flex">
    //         ${node.content.map(n => createHtml(n, highlight, op)).join(`<div>${node.operator.trim()}</div>`)}
    //     </div>
    //     `;
    if (op === '-' && node.content.length === 1) return `
        <div class="flex">
            <div>-</div>
            ${createHtml(node.content[0], highlight, op)}
        </div>
        `;
    console.error('cannot create HTML', node);
}