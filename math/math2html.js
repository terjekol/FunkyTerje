function createMenuHtml(options) {
    return Object.keys(options).map(f => `
        <button onclick="doMath('${f}')">${model.mathOperations[f].icon.replace(/\n/g, '<br/>')}</button>
    `).join('');
}

function showMathText(mathText, highlight) {
    const tree = parseMathText(mathText);
    document.getElementById('mathContent').innerHTML = createHtml(tree, hightlight);
}

function createHtml(node, hightlight) {
    return node.value != undefined ? `<div>${node.value.trim()}</div>` : createNodeHtml(node, highlight);
}

function createNodeHtml(node, highlight) {
    if (node.operator === '/') return `
        <div class="flex vertical">
            ${createHtml(node.content[0], highlight)}
            <div class="fraction">&nbsp;</div>
            ${createHtml(node.content[1], highlight)}
        </div>
        `;
    if (node.content.length > 1 && '+-'.includes(node.operator)) return `
        <div class="flex">
            ${node.content.map(n => createHtml(n, highlight)).join(`<div>${node.operator.trim()}</div>`)}
        </div>
        `;
    if (node.content.length > 1 && node.operator === '*') return `
        <div class="flex">
            ${node.content.map(n => createHtml(n, highlight)).join(`<div>${node.operator.trim()}</div>`)}
        </div>
        `;
    if (node.operator === '-' && node.content.length === 1) return `
        <div class="flex">
            <div>-</div>
            ${createHtml(node.content[0], highlight)}
        </div>
        `;
    console.error('cannot create HTML', node);
}