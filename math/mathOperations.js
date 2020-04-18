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
    const stepIndex = model.onGoingMathOperation.arguments.length;
    const step = selectedFunction.steps[stepIndex];
    model.onGoingMathOperation.step = step;
    updateView();
}

function doMath(arg) {
    const operation = model.onGoingMathOperation;
    const args = operation.arguments;
    if (operation.name === 'subtractTermOnBothSides') {
        subtractTermOnBothSides(arg);
    } else if (operation.name === 'moveTermToOtherSide') {
        moveTermToOtherSide(arg);
    } else if (operation.name === 'mergeTerms') {
        if (args.length === 0) {
            args.push(arg);
            updateView();
        } else {
            mergeTerms(args[0], arg);
        }
    } else if (operation.name === 'reduceFraction') {
    } else if (operation.name === 'divideBothSides') {
    } else if (operation.name === 'primeFactorize') {
    } else {
        console.error('unknown operation: ' + model.onGoingMathOperation.name);
    }
}

function subtractTermOnBothSides(indexes) {
    const tree = parseMathText(model.mathText);
    const selectedNode = nodeFromIndexes(indexes, tree);
    const newTree = makeNode('=', [
        makeNode('-', [tree.content[0], cloneNode(selectedNode)]),
        makeNode('-', [tree.content[1], cloneNode(selectedNode)]),
    ]);
    model.mathText = toString(newTree);
    resetAndUpdateView();
}

function moveTermToOtherSide(indexes) {
    const tree = parseMathText(model.mathText);
    const selectedNode = nodeFromIndexes(indexes, tree);
    delete selectedNode.operator;
    delete selectedNode.content;
    selectedNode.value = '0';
    const newTree = makeNode('=', [
        makeNode('-', [tree.content[0], cloneNode(selectedNode)]),
        makeNode('-', [tree.content[1], cloneNode(selectedNode)]),
    ]);
    model.mathText = toString(newTree);
    resetAndUpdateView();
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
    const node1 = isUnaryMinus(selectedNode1) ? selectedNode1.content[0] : selectedNode1;
    const node2 = isUnaryMinus(selectedNode2) ? selectedNode2.content[0] : selectedNode2;
    const typeTerm1 = getType(node1);
    const typeTerm2 = getType(node2);
    if (typeTerm1 > typeTerm2) {
        [node1, node2] = [node2, node1];
        [typeTerm1, typeTerm2] = [typeTerm2, typeTerm1];
    }

    if (typeTerm1 === 'constant') {
        if (typeTerm2 !== 'constant') return finishWithError('Konstantledd kan bare slås sammen med andre konstantledd.');
        mergeConstantAndConstant(node1, node2);
    } else if (typeTerm1 === 'letter') {
        if (typeTerm2 === 'product') {
        }
    } else if (typeTerm1 === 'product') {
        if (typeTerm2 !== 'product') return finishWithError('Kan ikke slå sammen disse leddene.');
        mergeProductAndProduct(node1, node2);
    } else if (typeTerm1 === 'division') {
    }

    removeUnariesInUnaries(tree);
    model.mathText = toString(tree);
    resetAndUpdateView();
}

function mergeProductAndProduct(node1, node2) {
    if (!productsExceptFromFirstConstantsAreEqual(node1, node2)) {
        return finishWithError('Produktledd må være like, bortsett fra ev. første konstantfaktor, for å kunne slås sammen.');
    }
    // const realFirstFactor = getFirstFactorInProduct(node1input);
    // realFirstFactor.value = parseInt(firstFactor1.value) + parseInt(firstFactor2.value);
    // removeNode(node2input);
    const factor1 = getFirstFactorInProduct(node1);
    const factor2 = getFirstFactorInProduct(node2);
    const constant1 = parseInt(factor1.value) * getCombinedSignOfTopLevelTerm(node1);
    const constant2 = parseInt(factor2.value) * getCombinedSignOfTopLevelTerm(node2);
    const newSum = constant1 + constant2;
    const isPositive1 = constant1 > 0;
    const isPositive2 = constant2 > 0;
    if (newSum === 0) {
        removeNode(node1);
        removeNode(node2);
    } else if (isPositive1 === isPositive2) {
        adjustConstant(factor1, newSum);
        removeNode(node2);
    } else {
        const positiveNode = isPositive1 ? node1 : node2;
        const negativeNode = isPositive1 ? node2 : node1;
        const positiveFactor = isPositive1 ? factor1 : factor2;
        const negativeFactor = isPositive1 ? factor2 : factor1;
        if (newSum > 0) {
            adjustConstant(positiveFactor, newSum);
            removeNode(negativeNode);
        }
        else {
            adjustConstant(negativeFactor, newSum);
            removeNode(positiveNode);
        }
    }
}

function productsExceptFromFirstConstantsAreEqual(node1input, node1input) {
    const node1 = cloneNode(node1input);
    const node2 = cloneNode(node1input);
    const wrapper1 = createWrapperEquation(node1);
    const wrapper2 = createWrapperEquation(node2);
    const firstFactor1 = getFirstFactorInProduct(node1);
    const firstFactor2 = getFirstFactorInProduct(node2);
    if (isNumber(firstFactor1)) removeNode(firstFactor1);
    if (isNumber(firstFactor2)) removeNode(firstFactor2);
    return nodesAreEqual(wrapper1, wrapper2);
}

function removeUnariesInUnaries(node) {
    if (node.value !== undefined) return;
    if (isUnaryMinus(node) && isUnaryMinus(node.content[0])) {
        const newNode = node.content[0].content[0];
        replaceNode(node, newNode);
        removeUnariesInUnaries(newNode);
        return;
    }
    removeUnariesInUnaries(node.content[0]);
    if (node.content.length === 2) removeUnariesInUnaries(node.content[1]);
}

function mergeConstantAndConstant(selectedNode1, selectedNode2) {
    const constant1 = parseInt(selectedNode1.value) * getCombinedSignOfTopLevelTerm(selectedNode1);
    const constant2 = parseInt(selectedNode2.value) * getCombinedSignOfTopLevelTerm(selectedNode2);
    const newSum = constant1 + constant2;
    const isPositive1 = constant1 > 0;
    const isPositive2 = constant2 > 0;
    if (newSum === 0) {
        removeNode(selectedNode1);
        removeNode(selectedNode2);
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
    resetAndUpdateView();
}

function divideBothSides(indexes) {
    resetAndUpdateView();
}

function primeFactorize(indexes) {
    resetAndUpdateView();
}

function resetAndUpdateView(indexes) {
    model.onGoingMathOperation = null;
    updateView();
}

function cloneNode(node) {
    if (node.value != undefined) return { value: node.value };
    return node.content.length === 1
        ? makeNode(node.operator, [cloneNode(node.content[0])])
        : makeNode(node.operator, [cloneNode(node.content[0]), cloneNode(node.content[1])]);
}

