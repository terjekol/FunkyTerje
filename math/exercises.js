const levelExerciseFunctions = [
    () => createEquation([randomTerm(true, false)]),
    () => createEquation([randomTerm(true, false), randomTerm(false, false)]),
];

function createEquation(terms) {
    return randomFlipOrNot('x=' + terms.join(''));
}

function randomTerm(isFirst, includeX) {
    let txt = '';
    txt += randomSign(isFirst?'':null);
    txt += randomNumber();
    return includeX ? txt + '*x' : txt;
}

function randomNumber() {
    return 1 + Math.floor(Math.random() * 9);
}

function randomFlipOrNot(equation) {
    if (Math.random() < 0.5) return equation;
    const parts = equation.split('=');
    return parts[1] + '=' + parts[0];
}

function randomSign(plusSign) {
    return Math.random() < 0.5 ? '-' :
        plusSign === null ? '+' :
            plusSign;
}