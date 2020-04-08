const mathOperations = {
    subtractTermOnBothSides: [selectOneTerm],
    moveTermToOtherSide: [selectOneTerm],
    mergeTerms: [selectOneTerm, selectOneTerm],
    reduceFraction: [selectFactorInNumerator, selectFactorInDenominator],
    divideBothSides: [selectFactor],
    primeFactorize: [selectFactor],
};

function doMath(functionName) {
    model.onGoingMathOperation = functionName;
    const steps = mathOperations[function];
    if(!steps){
        console.error('unknown function ' + functionName);
        return;
    }
}
