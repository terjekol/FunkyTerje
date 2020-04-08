function doMath(functionName) {
    model.onGoingMathOperation = {
        name: functionName,
        arguments: [],
    };
    doMathImpl();
}

function doMathImpl() {
    const operation = model.onGoingMathOperation;
    const functionName =  operation.name;
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

