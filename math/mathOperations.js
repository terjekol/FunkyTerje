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
    if (args.length === 0 && [mergeTerms.name, reduceFraction.name].includes(operation.name)) {
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
    if ([undo.name, redo.name].includes(operation.name)) {
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

