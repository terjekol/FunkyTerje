const levelExerciseFunctions = [
    // 0 - ferdig løste lignigner
    () => createEquation([randomTerm(true, false)]),
    // 1 - + slå sammen ledd
    () => createEquation([randomTerm(true, false), randomTerm(false, false)]),
    // 2 - + trekke fra på begge sider 
    () => createEquation([randomTerm(false, false)], [randomTerm(true, false)]),
    // 3 - som før, men x-ledd også
    createEquationWithXTermsWithDiffOfOne,
    // 4 - flytte ledd istedenfor trekke fra på begge sider
    createEquationWithXTermsWithDiffOfOne,
    // 5 - + dele + forkorte
    createEquationWithNoNeedForPrimeFactorization,
    // 6 - primtallsfaktorisere
    createEquationWithNeedForPrimeFactorization,
];

function createEquationWithNeedForPrimeFactorization() {
    // ax=b
    const commonFactorCount = 1;//randomNumberFromRange(1, 4);
    const commonFactors = range(0, commonFactorCount).map(() => randomPrime());
    const product = commonFactors.reduce((value, total) => total * value, 1);
    const a = product * randomPrime();
    const b = product * randomFromArray([2, 3, 5, 7].filter(n => n !== a));
    const [a1, a2] = splitNumberInTwoRandomParts(a);
    const [b1, b2] = splitNumberInTwoRandomParts(b);
    return equationAxBequalsCxD(a1, -b1, -a2, b2);
}

function createEquationWithNoNeedForPrimeFactorization() {
    // ax=b, hvor a og b er forskjellige primtall
    const a = randomPrime();
    const b = randomFromArray([2, 3, 5, 7].filter(n => n !== a));
    const [a1, a2] = splitNumberInTwoRandomParts(a);
    const [b1, b2] = splitNumberInTwoRandomParts(b);
    return equationAxBequalsCxD(a1, -b1, -a2, b2);
}

function equationAxBequalsCxD(a, b, c, d) {
    return randomOrderSum(a, b) + '=' + randomOrderSum(c, d);
}

function splitNumberInTwoRandomParts(n) {
    const term = numberWithRandomSign(randomNumber());
    return [term, n - term];
}

function createEquationWithXTermsWithDiffOfOne() {
    const x1abs = randomNumberFromRange(2, 8);
    const x2abs = x1abs + 1;
    const x1 = randomBool() ? x1abs : -1 * x1abs;
    const x2 = x1 > 0 ? x2abs : -1 * x2abs;
    const c1abs = randomNumber();
    const c2abs = randomNumber();
    const c1 = randomBool() ? c1abs : -1 * c1abs;
    const c2 = c1 > 0 ? c2abs : -1 * c2abs;
    return equationAxBequalsCxD(x1, c1, x2, c2);
}

function numberWithRandomSign(number) {
    return randomBool() ? number : -1 * number;
}

function randomOrderSum(x, c) {
    const xTxt = x > 0 ? '+' + x : '' + x;
    const cTxt = c > 0 ? '+' + c : '' + c;
    const sum = randomBool()
        ? xTxt + '*x' + cTxt
        : cTxt + xTxt + '*x';
    return sum.startsWith('+') ? sum.substr(1) : sum;
}

function randomBool() {
    return Math.random() < 0.5;
}

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

function randomFromArray(array) {
    return array[randomNumberFromRange(0, array.length)];
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