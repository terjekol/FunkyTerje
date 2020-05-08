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
    return typeof (node.value) === 'string'
        && node.value.length > 0
        && node.value.split('').filter(c => c < '0' || c > '9').length === 0;
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
    return firstParentOperatorOtherThan('+-', node) === '=' && !isUnaryMinus(node.parent);
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

function range(min, max) {
    const count = max - min;
    return Array.from(Array(count).keys()).map(n => n + min);
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}const levelExerciseFunctions = [
    // 0 - ferdig løste lignigner
    () => createEquation([randomTerm(true, false)]),
    // 1 - + slå sammen ledd
    () => createEquation([randomTerm(true, false), randomTerm(false, false)]),
    // 2 - + trekke fra på begge sider 
    () => createEquation([randomTerm(false, false)], [randomTerm(true, false)]),
    // 3 - som før, men x-ledd også
    createEquationWithXTermsWithDiffOfOne,
    // 4 - flytte ledd istedenfor trekke fra på begge sider
    createEquationWithXTermsWithDiffOfOne,
    // 5 - + dele + forkorte
    createEquationWithNoNeedForPrimeFactorization,
    // 6 - primtallsfaktorisere
    createEquationWithNeedForPrimeFactorization,
];

function createEquationWithNeedForPrimeFactorization() {
    // ax=b
    const commonFactorCount = randomNumberFromRange(1, 4);
    const commonFactors = range(0, commonFactorCount).map(() => randomPrime());
    const product = commonFactors.reduce((value, total) => total * value, 1);
    const a = product * randomPrime();
    const b = product * randomFromArray([2, 3, 5, 7].filter(n => n !== a));
    const [a1, a2] = splitNumberInTwoRandomParts(a);
    const [b1, b2] = splitNumberInTwoRandomParts(b);
    return equationAxBequalsCxD(a1, -b1, -a2, b2);
}

function createEquationWithNoNeedForPrimeFactorization() {
    // ax=b, hvor a og b er forskjellige primtall
    const a = randomPrime();
    const b = randomFromArray([2, 3, 5, 7].filter(n => n !== a));
    const [a1, a2] = splitNumberInTwoRandomParts(a);
    const [b1, b2] = splitNumberInTwoRandomParts(b);
    return equationAxBequalsCxD(a1, -b1, -a2, b2);
}

function equationAxBequalsCxD(a, b, c, d) {
    return randomOrderSum(a, b) + '=' + randomOrderSum(c, d);
}

function splitNumberInTwoRandomParts(n) {
    const term = numberWithRandomSign(randomNumber());
    return [term, n - term];
}

function createEquationWithXTermsWithDiffOfOne() {
    const x1abs = randomNumberFromRange(2, 8);
    const x2abs = x1abs + 1;
    const x1 = randomBool() ? x1abs : -1 * x1abs;
    const x2 = x1 > 0 ? x2abs : -1 * x2abs;
    const c1abs = randomNumber();
    const c2abs = randomNumber();
    const c1 = randomBool() ? c1abs : -1 * c1abs;
    const c2 = c1 > 0 ? c2abs : -1 * c2abs;
    return equationAxBequalsCxD(x1, c1, x2, c2);
}

function numberWithRandomSign(number) {
    return randomBool() ? number : -1 * number;
}

function randomOrderSum(x, c) {
    const xTxt = x > 0 ? '+' + x : '' + x;
    const cTxt = c > 0 ? '+' + c : '' + c;
    const sum = randomBool()
        ? xTxt + '*x' + cTxt
        : cTxt + xTxt + '*x';
    return sum.startsWith('+') ? sum.substr(1) : sum;
}

function randomBool() {
    return Math.random() < 0.5;
}

function createEquation(terms1, terms2) {
    if (!terms2) return randomFlipOrNot('x=' + terms1.join(''));
    return randomFlipOrNot('x' + terms1.join('') + '=' + terms2.join(''));
}

function randomTerm(isFirst, includeX) {
    let txt = '';
    txt += randomSign(isFirst ? '' : null);
    txt += randomNumber();
    return includeX ? txt + '*x' : txt;
}

function randomNumberFromRange(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function randomNumber() {
    return randomNumberFromRange(1, 9)
}

function randomPrime() {
    return [2, 3, 5, 7][randomNumberFromRange(0, 3)]
}

function randomFromArray(array) {
    return array[randomNumberFromRange(0, array.length)];
}

function randomFlipOrNot(equation) {
    if (Math.random() < 0.5) return equation;
    const parts = equation.split('=');
    return parts[1] + '=' + parts[0];
}

function randomSign(plusSign) {
    return Math.random() < 0.5 ? '-' :
        plusSign === null ? '+' :
            plusSign;
}/*
    EXPR --> TERM {( "+" | "-" ) TERM}
    TERM --> FACT {( "*" | "/" ) FACT}
    FACTOR --> P ["^" FACTOR]
    P --> v | "(" EXPRESSION ")" | "-" TERM
*/

//parse(['x']);
// parse(['x','+','y']);
// console.log(parse(['x', '+', 'y', '*', '2']));
//console.log(parse(['x', '+', '1', '/', '(', 'y', '+', '2', ')']));
//setTimeout(() => show('2+x-1'), 100);

function parseMathText(mathText) {
    const equalSignIndex = mathText.indexOf('=');
    if (equalSignIndex == -1) {
        const tokens = lex(mathText);
        return parse(tokens);
    }
    const leftSide = mathText.substr(0, equalSignIndex);
    const rightSide = mathText.substr(equalSignIndex + 1);
    const leftSideTree = parseMathText(leftSide);
    const rightSideTree = parseMathText(rightSide);
    let tree = makeNode('=', [leftSideTree, rightSideTree]);
    tree = addParentAndId(tree, null);
    return tree;
}

function toString(node) {
    if (node.value != undefined) {
        return node.value;
    }
    if (isUnaryMinus(node)) {
        if (isFirstTerm(node)) return '-' + toString(node.content[0]);
        else return '(-' + toString(node.content[0]) + ')';
    }
    if (node.operator === '/') {
        return '(' + toString(node.content[0]) + ')' + node.operator + '(' + toString(node.content[1]) + ')';
    }
    if (node.operator === '-' && '+-'.includes(node.content[1].operator)) {
        return toString(node.content[0]) + node.operator + '(' + toString(node.content[1]) + ')';
    }
    return toString(node.content[0]) + node.operator + toString(node.content[1]);
}

function isFirstTerm(node) {
    const isFirstWithParent = node.parent && node === node.parent.content[0];
    if (node.parent && '+-'.includes(parentOperator(node))) return isFirstWithParent && isFirstTerm(node.parent);
    return true;
}

function addParentAndId(node, parent) {
    if (!node) return;
    node.parent = parent;
    if (!node.content) return;
    for (var child of node.content) {
        addParentAndId(child, node);
    }
    return node;
}

function lex(mathText) {
    const isDigit = char => char >= '0' && char <= '9';
    const lastCharacter = text => text.length === 0 ? null : text[text.length - 1];
    const addSeparator = (char, text) => text.length > 0 && (!isDigit(char) || !isDigit(lastCharacter(text)));
    const separator = (char, text) => addSeparator(char, text) ? ',' : '';
    const handleOneChar = (total, current) => total + separator(current, total) + current;
    const chars = mathText.split('');
    const charsWithSeparators = chars.reduce(handleOneChar, '');
    return charsWithSeparators.split(',');
}

function parse(tokens) {
    const state = parseExpression(tokens);
    return state.tokens.length > 0 ? null : state.tree;
}

function parseExpression(tokens) {
    return parseMultipart(tokens, '+-', parseTerm);
}

function parseTerm(tokens) {
    return parseMultipart(tokens, '*/', parseFactor);
}

function parseMultipart(tokens, operators, parseFn) {
    let partState1 = parseFn(tokens);
    while (operators.includes(partState1.tokens[0])) {
        const operator = partState1.tokens.shift();
        const partState2 = parseFn(partState1.tokens);
        partState1.tree = makeNode(operator, [partState1.tree, partState2.tree])
        partState1.tokens = partState2.tokens;
    }
    return partState1;
}

function parseFactor(tokens) {
    const state = parseParenthesisValueOrUnary(tokens);
    let myTokens = state.tokens;
    if (myTokens[0] !== '^') return state;
    myTokens.shift();
    const factorState = parseFactor(myTokens);
    return makeState(factorState.tokens, makeNode('^', [state.tree, factorState.tree]));
}

function parseParenthesisValueOrUnary(tokens) {
    if (isNumberOrLetter(tokens[0])) {
        const value = tokens.shift();
        return makeState(tokens, makeLeaf(value));
    } else if (tokens[0] === '(') {
        tokens.shift();
        const state = parseExpression(tokens);
        if (tokens.shift() !== ')') console.error('expected )');
        return state;
    } else if (tokens[0] === '-') {
        tokens.shift();
        const state = parseFactor(tokens);
        return makeState(tokens, makeNode('-', [state.tree]));
    } else {
        console.error('Error in parseParenthesisValueOrUnary. Tokens: ', tokens)
    }
}

function isNumberOrLetter(text) {
    return text[0] >= '0' && text[0] <= '9' || text[0] >= 'a' && text[0] <= 'z';
}

function makeNode(operator, content) {
    return { operator, content };
}

function makeLeaf(value) {
    return { value };
}

function makeState(tokens, tree) {
    return { tokens, tree };
}function createMenuHtml(options, onGoingMathOperation) {
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
    const icon = model.mathOperations[f].icon;
    if (icon[0] === '^') return `<span style="font-size: 160%">${icon.substring(1)}</span>`;
    return icon
        .replace(/\n/g, '<br/>')
        .replace(/ /g, '&nbsp;');
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
function selectMath(functionName) {
    model.errorMessage = '';
    model.onGoingMathOperation = {
        name: functionName,
        arguments: [],
    };
    selectMathImpl();
}

function selectMathImpl() {
    const operation = model.onGoingMathOperation;
    const functionName = operation.name;
    const selectedFunction = model.mathOperations[functionName];
    if (!selectedFunction.steps) {
        console.error('unknown function ' + functionName);
        return;
    }
    operation.steps = selectedFunction.steps.map(step => model.steps[step]);
    const stepIndex = model.onGoingMathOperation.arguments.length;
    const step = selectedFunction.steps[stepIndex];
    model.onGoingMathOperation.step = step;
    if (operation.steps.length === 0) doMath();
    updateView();
}

function doMath(arg) {
    const operation = model.onGoingMathOperation;
    const args = operation.arguments;
    if (args.length === 0 && ['mergeTerms', 'reduceFraction'].includes(operation.name)) {
        nextStep(arg);
        return;
    }
    args.push(arg);
    const func = eval(operation.name);
    if (!isFunction(func)) {
        console.error('unknown operation: ' + model.onGoingMathOperation.name);
        return;
    }
    func(...args);
    if (['undo', 'redo'].includes(operation.name)) {
        resetAndUpdateView();
        return;
    }

    const history = model.history.items;
    const index = model.history.index;
    if (index < history.length) {
        history.splice(index + 1);
    }
    history.push(model.mathText);
    model.history.index++;
    resetAndUpdateView();
}

function undo() {
    const history = model.history;
    const items = history.items;
    if (items.length === 0 || history.index === 0) return;
    history.index--;
    model.mathText = items[history.index];
}

function redo() {
    const history = model.history.items;
    const index = model.history.index;
    if (index + 1 >= history.length) return;
    model.history.index++;
    model.mathText = history[model.history.index];
}

function nextStep(arg) {
    const operation = model.onGoingMathOperation;
    operation.arguments.push(arg);
    selectMathImpl();
    updateView();
}

function primeFactorize(indexes) {
    const tree = parseMathText(model.mathText);
    const node = nodeFromIndexes(indexes, tree);
    if (!isNumber(node)) return;
    const number = parseInt(node.value);
    const primeFactors = primeFactorizeImpl(number);
    const product = parseMathText(primeFactors);
    replaceNode(node, product);
    model.mathText = toString(tree);
}

function findLowestFactor(number, factor) {
    return number % factor == 0 ? factor : findLowestFactor(number, factor + 1);
}

function primeFactorizeImpl(number) {
    const factor = findLowestFactor(number, 2);
    if (factor === number) return '' + number;
    return factor + '*' + primeFactorizeImpl(number / factor);
}

function subtractTermOnBothSides(indexes) {
    moveTermToOtherSide(indexes, true);
}

function moveTermToOtherSide(indexes, subtractOnBothSides) {
    const tree = parseMathText(model.mathText);
    const node = nodeFromIndexes(indexes, tree);
    const nodeSide = getSideOfEquaction(node);
    const otherSide = 1 - nodeSide;
    const existingSign = getCombinedSignOfTopLevelTerm(node);
    let count = 0;
    while (removeUnaryMinusFactors(node, tree)) count++;
    const newSign = count % 2 === 1
        ? (existingSign === 1 ? '+' : '-')
        : (existingSign === 1 ? '-' : '+');
    replaceNode(tree.content[otherSide], sideWithNewNode(tree, otherSide, node, newSign));
    if (subtractOnBothSides) {
        replaceNode(tree.content[nodeSide], sideWithNewNode(tree, nodeSide, node, newSign));
    } else {
        replaceNode(node, { value: '0' });
    }
    addParentAndId(tree);
    doSimplifications(tree);
    model.mathText = toString(tree);
}

function removeUnaryMinusFactors(node) {
    if (node.value !== undefined || node.operator !== '*') return false;
    if (isUnaryMinus(node.content[0])) {
        replaceNode(node.content[0], node.content[0].content[0]);
        return true;
    } else {
        if (removeUnaryMinusFactors(node.content[0])) return true;
    }
    if (isUnaryMinus(node.content[1])) {
        replaceNode(node.content[1], node.content[1].content[0]);
        return true;
    } else {
        if (removeUnaryMinusFactors(node.content[1])) return true;
    }
    return false;
}

function sideWithNewNode(tree, side, node, sign) {
    const newNodeContent = [tree.content[side], node].map(cloneNode);
    return makeNode(sign, newNodeContent);
}

function getSideOfEquaction(node) {
    return parentOperator(node) === '='
        ? indexWithParent(node)
        : getSideOfEquaction(node.parent);
}

function mergeTerms(indexes1, indexes2) {
    const tree = parseMathText(model.mathText);
    const selectedNode1 = nodeFromIndexes(indexes1, tree);
    const selectedNode2 = nodeFromIndexes(indexes2, tree);
    if (nodesAreOnSeparateSides(selectedNode1, selectedNode2, tree)) {
        return finishWithError('Kan bare slå sammen ledd som er på samme side av ligningen.');
    }
    if (!isTopLevelTerm(selectedNode1) || !isTopLevelTerm(selectedNode2)) {
        return finishWithError('Kan bare slå sammen ledd som er på toppnivå på høyre eller venstre side av ligningen.');
    }
    let node1 = isUnaryMinus(selectedNode1) ? selectedNode1.content[0] : selectedNode1;
    let node2 = isUnaryMinus(selectedNode2) ? selectedNode2.content[0] : selectedNode2;
    let typeTerm1 = getType(node1);
    let typeTerm2 = getType(node2);
    if (typeTerm1 > typeTerm2) [node1, node2, typeTerm1, typeTerm2] = [node2, node1, typeTerm2, typeTerm1];
    if (typeTerm1 === 'constant') {
        if (typeTerm2 !== 'constant') return finishWithError('Konstantledd kan bare slås sammen med andre konstantledd.');
        mergeConstantAndConstant(node1, node2);
    } else if (typeTerm1 === 'letter' && ['product', 'letter'].includes(typeTerm2)) {
        const newNode1 = replaceLetterWithProductOfOne(node1);
        const newNode2 = replaceLetterWithProductOfOne(node2);
        addParentAndId(tree);
        mergeProductAndProduct(newNode1, newNode2);
    } else if (typeTerm1 === 'product') {
        if (typeTerm2 !== 'product') return finishWithError('Kan ikke slå sammen disse leddene.');
        mergeProductAndProduct(node1, node2);
    } else if (typeTerm1 === 'division') {
    }
    addParentAndId(tree);
    doSimplifications(tree);
    model.mathText = toString(tree);
}

function replaceLetterWithProductOfOne(node) {
    if (!isLetter(node)) return node;
    const newNode = makeNode('*', [{ value: '1' }, node]);
    replaceNode(node, newNode);
    return newNode;
}

function mergeProductAndProduct(node1, node2) {
    if (!productsExceptFromFirstConstantsAreEqual(node1, node2)) {
        return finishWithError('Produktledd må være like, bortsett fra ev. første konstantfaktor, for å kunne slås sammen.');
    }
    const factor1 = getFirstFactorInProduct(node1);
    const factor2 = getFirstFactorInProduct(node2);
    const value1 = numberOrUnaryMinusNumberValue(factor1) || 1;
    const value2 = numberOrUnaryMinusNumberValue(factor2) || 1;
    const constant1 = value1 * getCombinedSignOfTopLevelTerm(node1);
    const constant2 = value2 * getCombinedSignOfTopLevelTerm(node2);
    const newSum = constant1 + constant2;
    const isPositive1 = constant1 > 0;
    const isPositive2 = constant2 > 0;
    if (newSum === 0) {
        removeNode(node1);
        removeNode(node2);
    } else if (isPositive1 === isPositive2) {
        adjustFactor(node1, factor1, newSum);
        removeNode(node2);
    } else {
        const positiveNode = isPositive1 ? node1 : node2;
        const negativeNode = isPositive1 ? node2 : node1;
        const positiveFactor = isPositive1 ? factor1 : factor2;
        const negativeFactor = isPositive1 ? factor2 : factor1;
        if (newSum > 0) {
            adjustFactor(positiveNode, positiveFactor, newSum);
            removeNode(negativeNode);
        }
        else {
            adjustFactor(negativeNode, negativeFactor, newSum);
            removeNode(positiveNode);
        }
    }
}

function adjustFactor(node, factor, constant) {
    if (isNumber(factor)) {
        factor.value = '' + Math.abs(constant);
        return;
    }
    if (isUnaryMinus(factor)) {
        adjustConstant(factor.content[0], constant);
        return;
    }
    replaceNode(node, makeNode('*', [{ value: '' + constant }, node]));
}

function productsExceptFromFirstConstantsAreEqual(node1input, node2input) {
    const node1 = cloneNode(node1input);
    const node2 = cloneNode(node2input);
    const wrapper1 = createWrapperEquation(node1);
    const wrapper2 = createWrapperEquation(node2);
    const firstFactor1 = getFirstFactorInProduct(node1);
    const firstFactor2 = getFirstFactorInProduct(node2);
    const value1 = numberOrUnaryMinusNumberValue(firstFactor1);
    const value2 = numberOrUnaryMinusNumberValue(firstFactor2);
    if (value1 !== null) removeNode(firstFactor1);
    if (value2 !== null) removeNode(firstFactor2);
    return nodesAreEqual(wrapper1, wrapper2);
}

function numberOrUnaryMinusNumberValue(node) {
    if (isNumber(node)) return parseInt(node.value);
    if (isUnaryMinus(node) && isNumber(node.content[0])) return -1 * parseInt(node.content[0].value);
    return null;
}

function doSimplifications(node) {
    while (replaceProductsOfOne(node));
    while (removeUnariesInUnaries(node));
    while (removeUnariesInSecondPositionSubtraction(node));
    while (replaceDivideByOne(node));
    while (removeTermsZero(node));
}

function removeTermsZero(node) {
    if (isNumber(node) && node.value === '0' && '+-'.includes(parentOperator(node))) {
        if (isUnaryMinus(node.parent)) {
            removeNode(node.parent);
        } else if (indexWithParent(node) === 0 && parentOperator(node) === '-') {
            removeNode(node);
        } else {
            replaceNode(node.parent, siblingNode(node));
        }
        return true;
    }
    if (node.value !== undefined) return false;
    if (removeTermsZero(node.content[0])) return true;
    if (node.content.length > 1 && removeTermsZero(node.content[1])) return true;
    return false;
}

function replaceDivideByOne(node) {
    const isDenominator = parentOperator(node) === '/' && indexWithParent(node) === 1;
    if (isDenominator && node.value === '1') {
        const fraction = node.parent;
        replaceNode(fraction, fraction.content[0]);
        return true;
    }
    if (node.value !== undefined) return false;
    if (replaceDivideByOne(node.content[0])) return true;
    if (node.content.length > 1 && replaceDivideByOne(node.content[1])) return true;
    return false;
}

function replaceProductsOfOne(node) {
    if (node.value !== undefined) return false;
    if (node.operator !== '*') {
        if (replaceProductsOfOne(node.content[0])) return true;
        if (node.content.length > 1 && replaceProductsOfOne(node.content[1])) return true;
        return false;
    }
    const value1 = numberOrUnaryMinusNumberValue(node.content[0]);
    const value2 = numberOrUnaryMinusNumberValue(node.content[1]);
    const isOneOrMinus1 = Math.abs(value1) === 1;
    const isOneOrMinus2 = Math.abs(value2) === 1;
    if (!isOneOrMinus1 && replaceProductsOfOne(node.content[0])) return true;
    if (!isOneOrMinus2 && replaceProductsOfOne(node.content[1])) return true;
    if (isOneOrMinus1 || isOneOrMinus2) {
        replaceNode(node, node.content[isOneOrMinus1 ? 1 : 0]);
        return true;
    }
    return false;
}

function removeUnariesInSecondPositionSubtraction(node) {
    if (node.value !== undefined) return false;
    if (node.operator === '-' && node.content.length == 2 && isUnaryMinus(node.content[1])) {
        node.operator = '+';
        node.content[1] = node.content[1].content[0];
        return true;
    }
    if (removeUnariesInSecondPositionSubtraction(node.content[0])) return true;
    if (node.content.length === 2 && removeUnariesInSecondPositionSubtraction(node.content[1])) return true;
    return false;
}

function removeUnariesInUnaries(node) {
    if (node.value !== undefined) return false;
    if (isUnaryMinus(node) && isUnaryMinus(node.content[0])) {
        const newNode = node.content[0].content[0];
        replaceNode(node, newNode);
        removeUnariesInUnaries(newNode);
        return true;
    }
    if (removeUnariesInUnaries(node.content[0])) return true;
    if (node.content.length === 2 && removeUnariesInUnaries(node.content[1])) return true;
    return false;
}

function mergeConstantAndConstant(selectedNode1, selectedNode2) {
    const constant1 = parseInt(selectedNode1.value) * getCombinedSignOfTopLevelTerm(selectedNode1);
    const constant2 = parseInt(selectedNode2.value) * getCombinedSignOfTopLevelTerm(selectedNode2);
    const newSum = constant1 + constant2;
    const isPositive1 = constant1 > 0;
    const isPositive2 = constant2 > 0;
    if (newSum === 0) {
        removeNode(selectedNode1);
        replaceNode(selectedNode2, {value: '0'});
    } else if (isPositive1 === isPositive2) {
        adjustConstant(selectedNode1, newSum);
        removeNode(selectedNode2);
    } else {
        const positiveNode = isPositive1 ? selectedNode1 : selectedNode2;
        const negativeNode = isPositive1 ? selectedNode2 : selectedNode1;
        if (newSum > 0) {
            adjustConstant(positiveNode, newSum);
            removeNode(negativeNode);
        } else {
            adjustConstant(negativeNode, newSum);
            removeNode(positiveNode);
        }
    }
}

function getType(node) {
    if (node.value !== undefined) {
        if (isNumber(node)) return 'constant';
        if (isLetter(node)) return 'letter';
        throw "unknown type: " + toString(node);
    }
    if (isUnaryMinus(node)) return 'unary minus';
    if (isMultiplication(node)) return 'product';
    if (isDivision(node)) return 'division';
    throw "unknown type: " + toString(node);
}

function adjustConstant(node, newConstant) {
    if (isNumber(node)) {
        node.value = '' + Math.abs(newConstant);
        return;
    }
    if (node.operator === '*') {
        const constantNode = getFirstConstantInProduct(node);
        if (constantNode !== null) constantNode.value = '' + Math.abs(newConstant);
        return;
    }
    if (node.operator === '/' || isUnaryMinus(node)) {
        adjustConstant(node.content[0], newConstant);
        return;
    }
    throw "cannot adjust constant in " + toString(node);
}

function finishWithError(errorMessage) {
    model.errorMessage = errorMessage;
    resetAndUpdateView();
    return 'dummy';
}

function createWrapperEquation(node) {
    const equation = makeNode('=', [{ value: 1 }, node]);
    addParentAndId(equation);
    return equation;
}

function getFirstFactorInProduct(product) {
    return isMultiplication(product.content[0])
        ? getFirstFactorInProduct(product.content[0])
        : product.content[0];
}

function getCombinedSignOfTopLevelTerm(node) {
    if (node.parent.operator === '=') return 1;
    const factor = node.parent.operator !== '-'
        || (node.parent.content.length === 2 && node.parent.content[0] === node)
        ? 1
        : -1;
    return factor * getCombinedSignOfTopLevelTerm(node.parent);
}

function getSignFromParent(node) {
    return isSecondPartOfMinus(node) ? -1 : 1;
}

function isSecondPartOfMinus(node) {
    return parentOperator(node) === '-' && node === node.parent.content[1];
}

function nodesAreOnSeparateSides(node1, node2, tree) {
    const firstIndexOnRightSide = indexesFromNode(tree.content[1]);
    const node1Side = indexesFromNode(node1) < firstIndexOnRightSide;
    const node2Side = indexesFromNode(node2) < firstIndexOnRightSide;
    return node1Side !== node2Side;
}

function nodesAreEqual(node1, node2) {
    const equalPrimitives = node1.value && node2.value && node1.value === node2.value;
    if (equalPrimitives) return true;
    return node1.operator === node2.operator
        && node1.content && node2.content
        && nodesAreEqual(node1.content[0], node2.content[0])
        && node1.content.length > 1 && node2.content.length > 1
        && nodesAreEqual(node1.content[1], node2.content[1]);
}

function removeNode(node) {
    const parent = node.parent;
    if (parent.operator === '-' && parent.content.length === 2 && indexWithParent(node) === 0) {
        parent.content.shift();
    } else if (isUnaryMinus(node.parent)) {
        removeNode(node.parent);
    } else {
        replaceNode(parent, siblingNode(node));
    }
}

function siblingNode(node) {
    const index = indexWithParent(node);
    const siblingIndex = otherIndex(index);
    return node.parent.content[siblingIndex];
}

function replaceNode(node, newNode) {
    node.parent.content[indexWithParent(node)] = newNode;
    newNode.parent = node.parent;
}

function otherIndex(index) {
    return index === 1 ? 0 : 1;
}

function indexWithParent(node) {
    return node.parent.content[0] === node ? 0 : 1;
}

function reduceFraction(indexes1, indexes2) {
    const tree = parseMathText(model.mathText);
    const node1 = nodeFromIndexes(indexes1, tree);
    const node2 = nodeFromIndexes(indexes2, tree);
    if (!nodesAreEqual(node1, node2)) {
        return finishWithError('Faktorene er ulike og kan ikke forkortes mot hverandre.');
    }
    replaceNode(node1, { value: '1' });
    replaceNode(node2, { value: '1' });
    addParentAndId(tree);
    doSimplifications(tree);
    model.mathText = toString(tree);
}

function divideBothSides(indexes) {
    const tree = parseMathText(model.mathText);
    const node = nodeFromIndexes(indexes, tree);
    replaceNode(tree.content[0], makeNode('/', [tree.content[0], cloneNode(node)]));
    replaceNode(tree.content[1], makeNode('/', [tree.content[1], cloneNode(node)]));
    model.mathText = toString(tree);
}

function resetAndUpdateView() {
    model.onGoingMathOperation = null;
    updateView();
}

function cloneNode(node) {
    if (node.value != undefined) return { value: node.value };
    return node.content.length === 1
        ? makeNode(node.operator, [cloneNode(node.content[0])])
        : makeNode(node.operator, [cloneNode(node.content[0]), cloneNode(node.content[1])]);
}

const model = {
    level: 4,
    mathText: 'x+3=5',
    history: {
        items: [],
        index: 0,
    },    
    steps: {
        selectOneTerm: 'Velg et ledd.',
        selectFactorInNumerator: 'Velg en faktor i telleren.',
        selectFactorInDenominator: 'Velg en faktor i nevneren.',
        selectTopLevelFactor: 'Velg et ledd eller en faktor i et ledd.',
        selectNumber: 'Velg et tall.',
    },
    mathOperations: {
    },
};

model.mathOperations[mergeTerms.name] = {
    steps: ['selectOneTerm', 'selectOneTerm'],
    icon: '∑',//'⭨⭩\n•',
    description: 'Slå sammen ledd',
    levels: {
        first: 1,
    }
};

model.mathOperations[subtractTermOnBothSides.name] = {
    steps: ['selectOneTerm'],
    icon: '|&minus;',
    description: 'Trekke fra på begge sider av ligningen',
    levels: {
        first: 2,
        last: 3,
    }
};

model.mathOperations[moveTermToOtherSide.name] = {
    steps: ['selectOneTerm'],
    icon: '↷\n=',
    description: 'Flytte ledd til den andre siden av ligningen',
    levels: {
        first: 4,
    }
};

model.mathOperations[divideBothSides.name] = {
    steps: ['selectTopLevelFactor'],
    icon: '|÷',
    description: 'Dele begge sider av ligningen',
    levels: {
        first: 5,
    }
};

model.mathOperations[reduceFraction.name] = {
    steps: ['selectFactorInNumerator', 'selectFactorInDenominator'],
    icon: '/\n‒\n/',
    description: 'Forkorte brøk',
    levels: {
        first: 5,
    }
};

model.mathOperations[primeFactorize.name] = {
    steps: ['selectNumber'],
    icon: '□\n⭩⭨\n□×□',
    description: 'Primtallsfaktorisere',
    levels: {
        first: 6,
    }
};

model.mathOperations[undo.name] = {
    steps: [],
    icon: '^⮪',
    description: 'Angre',
    levels: {
        first: 0,
    }
};

model.mathOperations[redo.name] = {
    steps: [],
    icon: '^⮫',
    description: 'Gjøre omigjen',
    levels: {
        first: 0,
    }
};

newExercise();

function updateView() {
    document.getElementById('app').innerHTML = `
        <div class="mainPart history">
            ${createHistoryHtml(true)}
        </div>
        <div id="mathContent" class="math mainPart">
            ${createMathText(model.mathText, getStep())}
        </div>            
        <div class="mainPart history">
            ${createHistoryHtml(false)}
        </div>              
        <div class="mainPart panel">
            <div id="txt">${getText()}</div>
            <div id="menuBar">
                ${createMenuHtml(model.mathOperations, model.onGoingMathOperation)}
            </div>
        </div>

        <div class="mainPart panel footer">         
            <div class="levels" >
                <button class="excercise"  onclick="${newExercise.name}()">Ny nivå ${model.level}-oppgave</button>
                <div style="width: 40px"></div>
                <input type="text" oninput="model.ownExercise=this.value"/>
                <button class="excercise" onclick="${newCustomExercise.name}()">Ny egen oppgave</button>
            </div>
            <div class="levels">
                Nivåer:
                ${createLevelsMenuHtml()}
            </div>                    
        </div>
    `;
}

function createHistoryHtml(isPreHistory) {
    const history = model.history;
    const index = history.index;
    const allItems = history.items;
    const limits = isPreHistory ? [0, index] : [index + 1, allItems.length];
    const items = model.history.items.slice(...limits);
    return items.map(mathText => `
        <div id="mathContent" class="math">
            ${createMathText(mathText, null)}
        </div>  
    `).join('');
}

function newExercise() {
    const fn = levelExerciseFunctions[model.level];
    newExerciseImpl(fn());
}

function newCustomExercise() {
    model.errorMessage = '';
    let result = null;
    try {
        result = parseMathText(model.ownExercise);
    } catch (error) {
        model.errorMessage = `Kan ikke tolke uttrykket <tt>${model.ownExercise}</tt>`;
        updateView();
        return;
    }
    newExerciseImpl(model.ownExercise);
}

function newExerciseImpl(exercise) {
    model.errorMessage = null;
    model.mathText = exercise;
    model.history.items.length = 0;
    model.history.items.push(exercise);
    model.history.index = 0;
    updateView();
}

function createLevelsMenuHtml() {
    return range(0, 7).map(level => `
        <button class="level ${level === model.level ? 'selectedLevel' : ''}"
                onclick="${selectLevel.name}(${level})">
            ${level}
        </button>
    `).join('');
}

function selectLevel(level) {
    model.level = level;
    updateView();
}

function getStep() {
    const operation = model.onGoingMathOperation;
    return operation ? operation.step : null;
}

function getText() {
    const message = createMessage();
    // const error = `<div class="error">${model.errorMessage || ''}</div>`;
    if (model.errorMessage) {
        const description = createDescriptionHtml('error', model.errorMessage, 'error');
        return createText(description, message);
    }
    const operation = model.onGoingMathOperation;
    if (!operation) return createText('', message);
    const step = operation ? operation.step : null;
    if (!step) return createText();
    const operationName = operation.name;
    const mathOperation = model.mathOperations[operationName];
    const description = createDescriptionHtml(operationName, mathOperation.description);
    const length = operation.arguments ? operation.arguments.length : 0;
    const stepsHtml = operation.steps.map((step, i) => `
        <li class="${i == length ? '' : 'passive'}">${step}</li>
        `).join('');
    return createText(description, `<ol>${stepsHtml}</ol>`);
}

function createDescriptionHtml(operationName, text, extraCssClass) {
    return `
        <div class="selectedFunction">
            <button class="display ${extraCssClass || ''}" disabled>
                ${getIcon(operationName)}
            </button>                     
            <div class="${extraCssClass || 'function'}">
                ${text}
            </div>
        </div>
        `;
}

function createMessage() {
    return model.mathText && isEquationSolved(model.mathText) ? 'Ligningen er løst.' :
        model.level === 0 ? '' :
            'Velg operasjon:';
}

function isEquationSolved(mathText) {
    const node = parseMathText(mathText);
    const letterOnOneSide = isLetter(node.content[0]) || isLetter(node.content[1]);
    const numberOnOneSide = isNumber(node.content[0]) || isNumber(node.content[1])
        || isUnaryNumber(node.content[0]) || isUnaryNumber(node.content[1]);
    if (letterOnOneSide && numberOnOneSide) return true;
    if (!letterOnOneSide) return false;
    const fraction = node.content[0].operator === '/' ? node.content[0]
        : node.content[1].operator === '/' ? node.content[1] : null;
    if (fraction === null) return false;
    if (!isNumber(fraction.content[0]) || !isNumber(fraction.content[1])) return false;
    const number1 = parseInt(fraction.content[0].value);
    const number2 = parseInt(fraction.content[1].value);
    return !primeFactorizeImpl(number1).includes('*')
        && !primeFactorizeImpl(number2).includes('*');
}

function isUnaryNumber(node) {
    return isUnaryMinus(node) && isNumber(node.content[0]);
}

function createText(fn, step) {
    return `
        <div>${fn || '&nbsp;'}</div>
        <div class="step"><i>${step || '&nbsp;'}</i></div>
        `;
}
