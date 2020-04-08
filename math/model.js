const model = {
    mathText: null,
    steps: {
        selectOneTerm: 'velg et ledd', 
        selectFactorInNumerator: 'velg en faktor i telleren',
        selectFactorInDenominator: 'velg en faktor i nevneren',
        selectFactor: 'velg en faktor',
    },
    mathOperations: {
        subtractTermOnBothSides: {
            steps: ['selectOneTerm'],
            icon: '|-',
            description: 'Trekke fra på begge sider av ligningen',
        },            
        moveTermToOtherSide: {
            steps:['selectOneTerm'],
            icon: '↷\n=',
            description: 'Flytte ledd til den andre siden av ligningen',
        },            
        mergeTerms: {
            steps:['selectOneTerm', 'selectOneTerm'],
            icon: 'Σ',
            description: 'Slå sammen ledd',
        },            
        reduceFraction: {
            steps:['selectFactorInNumerator', 'selectFactorInDenominator'],
            icon: '/\n‒\n/',
            description: 'Forkorte brøk',
        },            
        divideBothSides: {
            steps:['selectFactor'],
            icon: '|÷',
            description: 'Dele begge sider av ligningen',
        },            
        primeFactorize: {
            steps:['selectFactor'],
            icon: '•\n⭩⭨',
            description: 'Primtallsfaktorisere',
        },            
    },
};