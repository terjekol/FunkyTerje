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
    const firstIndexOnRightSide = nodeToPath(tree.content[1]);
    const node1Side = nodeToPath(selectedNode1) < firstIndexOnRightSide;
    const node2Side = nodeToPath(selectedNode2) < firstIndexOnRightSide;
    if (node1Side !== node2Side) {
        model.errorMessage = 'Kan bare slå sammen ledd som er på samme side av ligningen.';
        resetAndUpdateView();
        return;
    }
    if (!nodesAreEqual(selectedNode1, selectedNode2)) {
        model.errorMessage = 'Kan ikke slå sammen leddene.';
        resetAndUpdateView();
        return;
    }
    removeNode(selectedNode2);
    model.mathText = toString(tree);
    resetAndUpdateView();
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

function nodeFromIndexes(indexes, tree) {
    let node = tree;
    for (let index of indexes) {
        node = node.content[index];
    }
    return node;
}
