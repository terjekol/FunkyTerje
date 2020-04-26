const levelExerciseFunctions = [
    // 0 - ferdig løste lignigner
    () => createEquation([randomTerm(true, false)]),
    // 1 - + slå sammen ledd
    () => createEquation([randomTerm(true, false), randomTerm(false, false)]),
    // 2 - + trekke fra på begge sider 
    () => createEquation([randomTerm(false, false)], [randomTerm(true, false)]),
];

function createEquationWithOneDifferenceInXTerms() { }

function createEquation(terms1, terms2) {
    if (!terms2) return randomFlipOrNot('x=' + terms1.join(''));
    return randomFlipOrNot('x' + terms1.join('') + '=' + terms2.join(''));
}

function randomTerm(isFirst, includeX) {
    let txt = '';
    txt += randomSign(isFirst ? '' : null);
    txt += randomNumber();
    return includeX ? txt + '*x' : txt;
}

function randomNumberFromRange(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function randomNumber() {
    return randomNumberFromRange(1, 9)
}

function randomPrime() {
    return [2, 3, 5, 7][randomNumberFromRange(0, 3)]
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