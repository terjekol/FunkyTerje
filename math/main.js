newExercise();

function updateView() {
    document.getElementById('app').innerHTML = `
        <div class="mainPart history historyPre" onload="this.scrollTop = this.scrollHeight">
            ${createHistoryHtml(true)}
        </div>
        <div id="mathContent" class="math mainPart">
            ${createMathText(model.mathText, getStep())}
        </div>            
        <div class="mainPart history">
            ${createHistoryHtml(false)}
        </div>              
        <div class="mainPart panel">
            <div id="txt">${getText()}</div>
            <div id="menuBar">
                ${createMenuHtml(model.mathOperations, model.onGoingMathOperation)}
            </div>
        </div>

        <div class="mainPart panel footer">         
            <div class="levels" >
                <button class="exercise"  onclick="${newExercise.name}()">Ny nivå ${model.level}-oppgave</button>
                <div style="width: 40px"></div>
                <input type="text" oninput="${Object.keys({x: model})[0]}.${Object.keys(model)[2]}=this.value"/>
                <button class="exercise" onclick="${newCustomExercise.name}()">Ny egen oppgave</button>
            </div>
            <div class="levels">
                Nivåer:
                ${createLevelsMenuHtml()}
            </div>                    
        </div>
    `;
    const el = document.getElementsByClassName('historyPre')[0];
    el.scrollTop = el.scrollHeight;
}

function createHistoryHtml(isPreHistory) {
    const history = model.history;
    const index = history.index;
    const allItems = history.items;
    const limits = isPreHistory ? [0, index] : [index + 1, allItems.length];
    const items = model.history.items.slice(...limits);
    return items.map(mathText => `
        <div id="mathContent" class="math">
            ${createMathText(mathText, null)}
        </div>  
    `).join('');
}

function newExercise() {
    const fn = levelExerciseFunctions[model.level];
    newExerciseImpl(fn());
}

function newCustomExercise() {
    model.errorMessage = '';
    let result = null;
    try {
        result = parseMathText(model.ownExercise);
    } catch (error) {
        model.errorMessage = `Kan ikke tolke uttrykket <tt>${model.ownExercise}</tt>`;
        updateView();
        return;
    }
    newExerciseImpl(model.ownExercise);
}

function newExerciseImpl(exercise) {
    model.errorMessage = null;
    model.mathText = exercise;
    model.history.items.length = 0;
    model.history.items.push(exercise);
    model.history.index = 0;
    updateView();
}

function createLevelsMenuHtml() {
    return range(1, 7).map(level => `
        <button class="level ${level === model.level ? 'selectedLevel' : ''}"
                onclick="${selectLevel.name}(${level})">
            ${level}
        </button>
    `).join('');
}

function selectLevel(level) {
    model.level = level;
    updateView();
}

function getStep() {
    const operation = model.onGoingMathOperation;
    return operation ? operation.step : null;
}

function getText() {
    const message = createMessage();
    // const error = `<div class="error">${model.errorMessage || ''}</div>`;
    if (model.errorMessage) {
        const description = createDescriptionHtml('error', model.errorMessage, 'error');
        return createText(description, message);
    }
    const operation = model.onGoingMathOperation;
    if (!operation) return createText('', message);
    const step = operation ? operation.step : null;
    if (!step) return createText();
    const operationName = operation.name;
    const mathOperation = model.mathOperations[operationName];
    const description = createDescriptionHtml(operationName, mathOperation.description);
    const length = operation.arguments ? operation.arguments.length : 0;
    const stepsHtml = operation.steps.map((step, i) => `
        <li class="${i == length ? '' : 'passive'}">${step}</li>
        `).join('');
    return createText(description, `<ol>${stepsHtml}</ol>`);
}

function createDescriptionHtml(operationName, text, extraCssClass) {
    return `
        <div class="selectedFunction">
            <button class="display ${extraCssClass || ''}" disabled>
                ${getIcon(operationName)}
            </button>                     
            <div class="${extraCssClass || 'function'}">
                ${text}
            </div>
        </div>
        `;
}

function createMessage() {
    return model.mathText && isEquationSolved(model.mathText) ? 'Ligningen er løst.' :
        model.level === 0 ? '' :
            'Velg operasjon:';
}

function isEquationSolved(mathText) {
    const node = parseMathText(mathText);
    const letterOnOneSide = isLetter(node.content[0]) || isLetter(node.content[1]);
    const numberOnOneSide = isNumber(node.content[0]) || isNumber(node.content[1])
        || isUnaryNumber(node.content[0]) || isUnaryNumber(node.content[1]);
    if (letterOnOneSide && numberOnOneSide) return true;
    if (!letterOnOneSide) return false;
    const fraction = node.content[0].operator === '/' ? node.content[0]
        : node.content[1].operator === '/' ? node.content[1] : null;
    if (fraction === null) return false;
    if (!isNumber(fraction.content[0]) || !isNumber(fraction.content[1])) return false;
    const number1 = parseInt(fraction.content[0].value);
    const number2 = parseInt(fraction.content[1].value);
    return !primeFactorizeImpl(number1).includes('*')
        && !primeFactorizeImpl(number2).includes('*');
}

function isUnaryNumber(node) {
    return isUnaryMinus(node) && isNumber(node.content[0]);
}

function createText(fn, step) {
    return `
        <div>${fn || '&nbsp;'}</div>
        <div class="step"><i>${step || '&nbsp;'}</i></div>
        `;
}

