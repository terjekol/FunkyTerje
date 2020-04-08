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

function createHtml(node, highlight, parentOperator) {
    if (node.value != undefined) {
        return `<div>${node.value.trim()}</div>`;
    } else {
        return createNodeHtml(node, highlight);
    }
}

function createNodeHtml(node, highlight) {
    const op = node.operator;
    if (op === '/') return `
        <div class="flex vertical">
            ${createHtml(node.content[0], highlight, op)}
            <div class="fraction">&nbsp;</div>
            ${createHtml(node.content[1], highlight, op)}
        </div>
        `;
    if (node.content.length > 1 && op === '=') return `
        <div class="flex">
            ${node.content.map(n => createHtml(n, highlight, op)).join(`<div>${node.operator.trim()}</div>`)}
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
    if (node.content.length > 1) return `
        <div class="flex">
            ${node.content.map(n => createHtml(n, highlight, op)).join(`<div>${node.operator.trim()}</div>`)}
        </div>
        `;
    if (op === '-' && node.content.length === 1) return `
        <div class="flex">
            <div>-</div>
            ${createHtml(node.content[0], highlight, op)}
        </div>
        `;
    console.error('cannot create HTML', node);
}