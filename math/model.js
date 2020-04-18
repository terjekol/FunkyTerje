const model = {
    mathText: null,
    steps: {
        selectOneTerm: 'velg et ledd', 
        selectFactorInNumerator: 'velg en faktor i telleren',
        selectFactorInDenominator: 'velg en faktor i nevneren',
        selectFactor: 'velg en faktor',
        selectNumber: 'velg et tall',
    },
    mathOperations: {
        subtractTermOnBothSides: {
            steps: ['selectOneTerm'],
            icon: '|&minus;',
            description: 'Trekke fra på begge sider av ligningen',
        },            
        moveTermToOtherSide: {
            steps:['selectOneTerm'],
            icon: '↷\n=',
            description: 'Flytte ledd til den andre siden av ligningen',
        },            
        mergeTerms: {
            steps:['selectOneTerm', 'selectOneTerm'],
            icon: '∑',//'⭨⭩\n•',
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
            steps:['selectNumber'],
            icon: '□\n⭩⭨\n□×□',
            description: 'Primtallsfaktorisere',
        },            
    },
};
