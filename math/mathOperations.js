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
        if(args.length===0){
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

function subtractTermOnBothSides(){
    resetAndUpdateView();
}

function moveTermToOtherSide(){
    resetAndUpdateView();
}

function mergeTerms(){
    resetAndUpdateView();
}

function reduceFraction(){
    resetAndUpdateView();
}

function divideBothSides(){
    resetAndUpdateView();
}

function primeFactorize(){
    resetAndUpdateView();
}

function resetAndUpdateView(){
    model.onGoingMathOperation = null;
    updateView();
}

