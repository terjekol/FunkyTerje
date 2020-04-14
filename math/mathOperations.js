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

    if (typeTerm1 === 'constant') {
        if (typeTerm2 !== 'constant') return finishWithError('Konstantledd kan bare slås sammen med andre konstantledd.');
        mergeConstantAndConstant(node1, node2);
    } else if (typeTerm1 === 'letter') {
    } else if (typeTerm1 === 'product') {
    } else if (typeTerm1 === 'division') {
    }


    // const extraction1 = extractConstant(selectedNode1);
    // const extraction2 = extractConstant(selectedNode2);

    // const oneOrBothRestsIsNull = extraction1.theRest === null || extraction2.theRest === null;
    // const bothRestsAreNull = extraction1.theRest === null && extraction2.theRest === null;
    // if (!bothRestsAreNull && (oneOrBothRestsIsNull || !nodesAreEqual(extraction1.theRest, extraction2.theRest))) {
    //     return finishWithError('Leddene kan ikke slås sammen.');
    // }
    // const newSum = parseInt(extraction1.constant) + parseInt(extraction2.constant);
    // const isPositive1 = extraction1.constant > 0;
    // const isPositive2 = extraction2.constant > 0;
    // if (newSum === 0) {
    //     removeNode(selectedNode1);
    //     removeNode(selectedNode2);
    // } else if (isPositive1 === isPositive2) {
    //     adjustConstant(selectedNode1, newSum);
    //     removeNode(selectedNode2);
    // } else {
    //     const positiveNode = isPositive1 ? selectedNode1 : selectedNode2;
    //     const negativeNode = isPositive1 ? selectedNode2 : selectedNode1;
    //     if (newSum > 0) {
    //         adjustConstant(positiveNode, newSum);
    //         removeNode(negativeNode);
    //     } else {
    //         adjustConstant(negativeNode, newSum);
    //         removeNode(positiveNode);
    //     }
    // }
    model.mathText = toString(tree);
    resetAndUpdateView();
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
    }
    else if (isPositive1 === isPositive2) {
        adjustConstant(selectedNode1, newSum);
        removeNode(selectedNode2);
    }
    else {
        const positiveNode = isPositive1 ? selectedNode1 : selectedNode2;
        const negativeNode = isPositive1 ? selectedNode2 : selectedNode1;
        if (newSum > 0) {
            adjustConstant(positiveNode, newSum);
            removeNode(negativeNode);
        }
        else {
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

function extractConstant(node) {
    if (isLetter(node)) return { constant: 1 * getCombinedSignOfTopLevelTerm(node), theRest: node };
    if (isNumber(node)) return { constant: node.value * getCombinedSignOfTopLevelTerm(node), theRest: null };
    if (isUnaryMinus(node)) return extractConstant(node.content[0]);
    if (isMultiplication(node)) {
        const product = cloneNode(node);
        const wrapperEquation = createWrapperEquation(product);
        const factor = getFirstFactorInProduct(product);
        const extraction = extractConstant(factor);
        if (extraction === null) return null;
        return { constant: extraction.constant, theRest: node };
    }
    return null;
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
        && nodesAreEqual(node1.content[0], node2.content[1])
        && node1.content.length > 1 && node2.content.length > 1
        && nodesAreEqual(node1.content[0], node2.content[1]);
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

