const model = {
    mathText: null,
    mathOperations: {
        subtractTermOnBothSides: {
            steps: ['selectOneTerm'],
            icon: '|-',
        },            
        moveTermToOtherSide: {
            steps:['selectOneTerm'],
            icon: '↷\n=',
        },            
        mergeTerms: {
            steps:['selectOneTerm', 'selectOneTerm'],
            icon: 'Σ',
        },            
        reduceFraction: {
            steps:['selectFactorInNumerator', 'selectFactorInDenominator'],
            icon: '/\n‒\n/',
        },            
        divideBothSides: {
            steps:['selectFactor'],
            icon: '|÷',
        },            
        primeFactorize: {
            steps:['selectFactor'],
            icon: '•\n⭩⭨',
        },            
    },
};
