function createMenuHtml(options, onGoingMathOperation) {
    const name = onGoingMathOperation && onGoingMathOperation.name;
    const operations = Object.keys(options).filter(isOperationAvailable);
    return operations.map(f => `
        <button class="${name === f ? 'ongoing' : ''}" onclick="${selectMath.name}('${f}')">${getIcon(f)}</button>
    `).join('');
}

function isOperationAvailable(operationName) {
    const operation = model.mathOperations[operationName];
    return model.level >= operation.levels.first
        && (!operation.levels.last || model.level <= operation.levels.last);
}

function getIcon(f) {
    if (f === 'error') return '⚠';
    // const icon = model.mathOperations[f].icon;
    // if (icon[0] === '^') return `<span style="font-size: 160%">${icon.substring(1)}</span>`;
    // return icon
    //     .replace(/\n/g, '<br/>')
    //     .replace(/ /g, '&nbsp;');
    const svg = model.mathOperations[f].svg;

    return `
        <svg class="svgIcon" viewBox="0 0 ${svg.viewBox.width} ${svg.viewBox.height}">
            <path d="${svg.path}" />
        </svg>
    `;
}

function createMathText(mathText, highlight) {
    const tree = parseMathText(mathText);
    return createHtml(tree, highlight);
}

function createHtml(node, highlight, showOperator) {
    const isLeaf = node.value != undefined;
    const isActive = getIsActive(highlight, node);
    const cssClass = isActive ? 'highlight' : '';
    const onclick = isActive ? `onclick="${doMath.name}('${indexesFromNode(node)}')"` : '';
    const operatorHtml = showOperator ? `<div>${node.parent.operator.trim()}</div>` : '';
    const includeOperatorInSameHtml =
        node.operator !== '='
        && model.onGoingMathOperation && model.onGoingMathOperation.step == 'selectOneTerm';
    const contentHtml = isLeaf ? `<div>${node.value.trim()}</div>` : createNodeHtml(node, highlight);
    return includeOperatorInSameHtml
        ? `<div class="flex ${cssClass}" ${onclick}>${operatorHtml}${contentHtml}</div>`
        : `${operatorHtml}<div class="flex ${cssClass}" ${onclick}>${contentHtml}</div>`
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
    return highlight === 'selectOneTerm' && isTopLevelTerm(node)
        || highlight === 'selectNumber' && isNumber(node)
        || highlight === 'selectTopLevelFactor' && isTopLevelFactor(node)
        || highlight === 'selectFactorInNumerator' && isFactorInDivision(node, true)
        || highlight === 'selectFactorInDenominator' && isFactorInDivision(node, false);
}

function isTopLevelFactor(node) {
    if (isTopLevelTerm(node) && node.value !== undefined) return true;
    if (parentOperator(node) !== '*') return false;
    const product = getTopLevelProductOfFactor(node);
    return isTopLevelTerm(product);
}

function getTopLevelProductOfFactor(node) {
    return parentOperator(node) === '*'
        ? getTopLevelProductOfFactor(node.parent)
        : node;
}

function isFactorInDivision(node, lookInNumerator) {
    const isPrimitiveOrNotProduct = !node.operator || node.operator !== '*';
    if (isNumeratorOrDenominator(node, lookInNumerator)) return isPrimitiveOrNotProduct;
    const product = getTopLevelProductOfFactor(node);
    return (node.value !== undefined || node.operator !== '*')
        && isNumeratorOrDenominator(product, lookInNumerator);
}

function isNumeratorOrDenominator(node, numerator) {
    const index = numerator ? 0 : 1;
    return parentOperator(node) === '/' && indexWithParent(node) === index;
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
    if (node.content.length == 2) {
        const showOperator = node.operator !== '*' || showMultiplicationOperator(node);
        return `
        <div class="flex">
            ${createHtml(node.content[0], highlight)}            
            ${createHtml(node.content[1], highlight, showOperator)}
        </div>
        `;
    }
    if (op === '-' && node.content.length === 1) {
        const child = node.content[0];
        if (isNumber(child) || isLetter(child)) {
            return `
            <div class="flex">            
            -${createHtml(node.content[0], highlight)}
            </div>
            `;
        }
        return `
        <div class="flex">            
        (-${createHtml(node.content[0], highlight)})
        </div>
        `;
    }
    console.error('cannot create HTML', node);
}

function showMultiplicationOperator(node) {
    const isNumberOrUnaryMinusNumber = isNumber(node.content[0])
        || isUnaryMinus(node.content[0]) && isNumber(node.content[0].content[0]);
    if (isNumberOrUnaryMinusNumber && (isLetter(node.content[1]) || isMultiplication(node.content[1])))
        return false;
    return true;
}
