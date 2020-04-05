/*
    EXPR --> TERM {( "+" | "-" ) TERM}
    TERM --> FACT {( "*" | "/" ) FACT}
    FACTOR --> P ["^" FACTOR]
    P --> v | "(" EXPRESSION ")" | "-" TERM
*/

//parse(['x']);
// parse(['x','+','y']);
console.log(parse(['x', '+', 'y', '*', '2']));

/*
Eparser is
   var t : Tree
   t := E
   expect( end )
   return t
*/
function parse(tokens) {
    const state = parseExpression(tokens);
    return state.tokens.length > 0 ? null : state.tree;
}

/*
E is
   var t : Tree
   t := T
   while next = "+" or next = "-"
      const op := binary(next)
      consume
      const t1 := T
      t := mkNode( op, t, t1 )
   return t
*/
function parseExpression(tokens) {
    return parseMultipart(tokens, '+-', parseTerm);
}

/*
T is
   var t : Tree
   t := F
   while next = "*" or next = "/"
      const op := binary(next)
      consume
      const t1 := F
      t := mkNode( op, t, t1 )
   return t
*/
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

/*
F is
   var t : Tree
   t := P
   if next = "^"
        consume
        const t1 := F
        return mkNode( binary("^"), t, t1)
   else
        return t
*/
function parseFactor(tokens) {
    const state = parseParenthesisValueOrUnary(tokens);
    let myTokens = state.tokens;
    if (myTokens[0] !== '^') return state;
    myTokens.shift();
    const factorState = parseFactor(myTokens);
    return makeState(myTokens, makeNode('^', state.tree, factorState.tree));
}

/*
P is
   var t : Tree
   if next is a v
        t := mkLeaf( next )
        consume
        return t
   else if next = "("
        consume
        t := E
        expect( ")" )
        return t   
   else if next = "-"
        consume
        t := F
        return mkNode( unary("-"), t)
   else 
        error
*/
function parseParenthesisValueOrUnary(tokens) {
    if (isNumberOrLetter(tokens[0])) {
        const value = tokens.shift();
        return makeState(tokens, makeLeaf(value));
    } else if (tokens[0] === '(') {
        tokens.shift();
        const state = parseExpression(tokens);
        if (tokens.shift !== ')') console.error('expected )');
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
    return { operator, left, right };
}

function makeLeaf(value) {
    return { value };
}

function makeState(tokens, tree) {
    return { tokens, tree };
}