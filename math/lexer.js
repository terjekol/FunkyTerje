function lex(mathText) {
    const isDigit = char => char >= '0' && char <= '9';
    const lastCharacter = text => text.length === 0 ? null : text[text.length - 1];
    const addSeparator = (char, text) => !isDigit(char) || !isDigit(lastCharacter(text)) ? ',' : '';
    const handleOneChar = (total, current) => total + addSeparator(current, total) + current;
    const chars = mathText.split('');
    const charsWithSeparators = chars.reduce(handleOneChar, '');
    return charsWithSeparators.split(',');
}