function doMath(functionName) {
    model.onGoingMathOperation = {
        name: functionName,
        arguments: [],
    };
    doMathImpl();
}

function doMathImpl() {
    const selectedFunction = model.onGoingMathOperation;
    const functionName = selectedFunction.name;
    const functionDescription = mathOperations[functionName];
    if (!functionDescription.steps) {
        console.error('unknown function ' + functionName);
        return;
    }
    const stepIndex = model.onGoingMathOperation.arguments.length;
    const step = selectedFunction.steps[stepIndex];
    model.onGoingMathOperation.step = step;
    updateView();
}

