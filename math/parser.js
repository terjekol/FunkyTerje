/*
    EXPR --> TERM {( "+" | "-" ) TERM}
    TERM --> FACT {( "*" | "/" ) FACT}
    FACTOR --> P ["^" FACTOR]
    P --> v | "(" EXPRESSION ")" | "-" TERM
*/

//parse(['x']);
// parse(['x','+','y']);
// console.log(parse(['x', '+', 'y', '*', '2']));
//console.log(parse(['x', '+', '1', '/', '(', 'y', '+', '2', ')']));
//setTimeout(() => show('2+x-1'), 100);

function parseMathText(mathText) {
    const equalSignIndex = mathText.indexOf('=');
    if (equalSignIndex >= 0) {
        const leftSide = mathText.substr(0, equalSignIndex);
        const rightSide = mathText.substr(equalSignIndex + 1);
        return makeNode('=', parseMathText(leftSide), parseMathText(rightSide));
    }

    const tokens = lex(mathText);
    return parse(tokens);
}

function lex(mathText) {
    const isDigit = char => char >= '0' && char <= '9';
    const lastCharacter = text => text.length === 0 ? null : text[text.length - 1];
    const addSeparator = (char, text) => text.length > 0 && (!isDigit(char) || !isDigit(lastCharacter(text)));
    const separator = (char, text) => addSeparator(char, text) ? ',' : '';
    const handleOneChar = (total, current) => total + separator(current, total) + current;
    const chars = mathText.split('');
    const charsWithSeparators = chars.reduce(handleOneChar, '');
    return charsWithSeparators.split(',');
}

function parse(tokens) {
    const state = parseExpression(tokens);
    return state.tokens.length > 0 ? null : state.tree;
}

function parseExpression(tokens) {
    return parseMultipart(tokens, '+-', parseTerm);
}

function parseTerm(tokens) {
    return parseMultipart(tokens, '*/', parseFactor);
}

function parseMultipart(tokens, operators, parseFn) {
    let partState1 = parseFn(tokens);
    while (operators.includes(partState1.tokens[0])) {
        const operator = partState1.tokens.shift();
        const partState2 = parseFn(partState1.tokens);
        partState1.tree = makeNode(operator, partState1.tree, partState2.tree)
        partState1.tokens = partState2.tokens;
    }
    return partState1;
}

function parseFactor(tokens) {
    const state = parseParenthesisValueOrUnary(tokens);
    let myTokens = state.tokens;
    if (myTokens[0] !== '^') return state;
    myTokens.shift();
    const factorState = parseFactor(myTokens);
    return makeState(factorState.tokens, makeNode('^', state.tree, factorState.tree));
}

function parseParenthesisValueOrUnary(tokens) {
    if (isNumberOrLetter(tokens[0])) {
        const value = tokens.shift();
        return makeState(tokens, makeLeaf(value));
    } else if (tokens[0] === '(') {
        tokens.shift();
        const state = parseExpression(tokens);
        if (tokens.shift() !== ')') console.error('expected )');
        return state;
    } else if (tokens[0] === '-') {
        tokens.shift();
        const state = parseFactor(tokens);
        return makeState(tokens, makeNode('-', state.tree));
    } else {
        console.error('Error in parseParenthesisValueOrUnary. Tokens: ', tokens)
    }
}

function isNumberOrLetter(text) {
    return text[0] >= '0' && text[0] <= '9' || text[0] >= 'a' && text[0] <= 'z';
}

function makeNode(operator, left, right) {
    return { operator, content: [left, right] };
}

function makeLeaf(value) {
    return { value };
}

function makeState(tokens, tree) {
    return { tokens, tree };
}