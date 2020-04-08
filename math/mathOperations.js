function doMath(functionName) {
    model.onGoingMathOperation = {
        name: functionName,
        arguments: [],
    };
    const steps = mathOperations[functionName];
    if(!steps){
        console.error('unknown function ' + functionName);
        return;
    }
}
