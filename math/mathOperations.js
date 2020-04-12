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
    const extraction1 = extractConstant(selectedNode1);
    const extraction2 = extractConstant(selectedNode2);

    const oneOrBothRestsIsNull = extraction1.theRest === null || extraction2.theRest === null;
    const bothRestsAreNull = extraction1.theRest === null && extraction2.theRest === null;
    if (!bothRestsAreNull && (oneOrBothRestsIsNull || !nodesAreEqual(extraction1.theRest, extraction2.theRest))) {
        return finishWithError('Leddene kan ikke slås sammen.');
    }
    const newSum = parseInt(extraction1.constant) + parseInt(extraction2.constant);
    if (bothRestsAreNull) {
        const isFirstPositiveAndSecondNegative = extraction1.constant > 0 && extraction2.constant < 0;
        const nodeA = isFirstPositiveAndSecondNegative ? selectedNode2 : selectedNode1;
        const nodeB = nodeA === selectedNode1 ? selectedNode2 : selectedNode1;
        nodeA.value = Math.abs(newSum);
        removeNode(nodeB);
    } else {
        if (newSum === 1) {
            replaceNode(selectedNode1, extraction1.theRest);
        } else if (newSum === 0) {
            removeNode(selectedNode1);
        } else if (newSum < 0) {
            const negativConstantUnary = makeNode('-', [createConstantNode(-1 * newSum)]);
            replaceNode(selectedNode1, makeNode('*', [negativConstantUnary, extraction1.theRest]));
        } else {
            replaceNode(selectedNode1, makeNode('*', [createConstantNode(newSum), extraction1.theRest]));
        }
        removeNode(selectedNode2);
    }
    model.mathText = toString(tree);
    resetAndUpdateView();
}

function finishWithError(errorMessage) {
    model.errorMessage = errorMessage;
    resetAndUpdateView();
    return 'dummy';
}

function extractConstant(node) {
    if (isNumber(node)) return { constant: node.value * getSignFromParent(node), theRest: null };
    if (isLetter(node)) return { constant: getSignFromParent(node), theRest: { value: node.value } };
    if (isUnaryMinus(node)) {
        const constantAndTheRest = extractConstant(node.content[0]);
        constantAndTheRest.constant *= -1;
        return constantAndTheRest;
    }
    if (!'*/'.includes(node.operator)) {
        console.error('unexpected operator: ' + node.operator, node);
    }
    const isMultiplication = node.operator === '*';
    const product = cloneNode(isMultiplication ? node : node.content[1]);
    if (!isNumber(product.content[0])) return { constant: 1, theRest: cloneNode(node) };
    if (isMultiplication) return { constant: product.content[0].value, theRest: product.content[1] };
    const constant = product.content[0].value;
    const theRest = makeNode('/', [product.content[1], cloneNode(node.content[0])]);
    return { constant, theRest };
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
    if (parent.operator === '-' && indexWithParent(node) === 0) {
        parent.content.shift();
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

