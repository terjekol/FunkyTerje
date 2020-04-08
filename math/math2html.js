function createMenuHtml(options){
    return Object.keys(options).map(f=>`
        <button onclick="doMath('${f}')">${model.mathOperations[f].icon.replace(/\n/g,'<br/>')}</button>
    `).join('');
}

function showMathText(mathText) {
    const tree = parseMathText(mathText);
    document.getElementById('mathContent').innerHTML = createHtml(tree);
}

function createHtml(node) {
    return node.value != undefined ? `<div>${node.value.trim()}</div>` : createNodeHtml(node);
}

function createNodeHtml(node) {
    if (node.operator === '/') return `
        <div class="flex vertical">
            ${createHtml(node.content[0])}
            <div class="fraction">&nbsp;</div>
            ${createHtml(node.content[1])}
        </div>
        `;
    if (node.content.length > 1) return `
        <div class="flex">
            ${node.content.map(n => createHtml(n)).join(`<div>${node.operator.trim()}</div>`)}
        </div>
        `;
    if (node.operator === '-' && node.content.length === 1) return `
        <div class="flex">
            <div>-</div>
            ${createHtml(node.content[0])}
        </div>
        `;
    console.error('cannot create HTML', node);
}