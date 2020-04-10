function selectMath(functionName) {
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
    console.log(selectedFunction);
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
            mergeTerms(args[0], args[1]);
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

function moveTermToOtherSide(arg) {
    resetAndUpdateView();
}

function mergeTerms(arg1, arg2) {
    resetAndUpdateView();
}

function reduceFraction(arg1, arg2) {
    resetAndUpdateView();
}

function divideBothSides(arg) {
    resetAndUpdateView();
}

function primeFactorize(arg) {
    resetAndUpdateView();
}

function resetAndUpdateView(arg) {
    model.onGoingMathOperation = null;
    updateView();
}

