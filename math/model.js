const model = {
    mathText: 'x+1/(x+2)=5',
    mathOperations: {
        subtractTermOnBothSides: {
            steps: [selectOneTerm],
            icon: '|-',
        },            
        moveTermToOtherSide: {
            steps:[selectOneTerm],
            icon: '↷\n=',
        },            
        mergeTerms: {
            steps:[selectOneTerm, selectOneTerm],
            icon: 'Σ',
        },            
        reduceFraction: {
            steps:[selectFactorInNumerator, selectFactorInDenominator],
            icon: '/\n‒\n/',
        },            
        divideBothSides: {
            steps:[selectFactor],
            icon: '|÷',
        },            
        primeFactorize: {
            steps:[selectFactor],
            icon: '•\n⭩⭨',
        },            
    },
};
