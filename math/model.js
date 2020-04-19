const model = {
    mathText: null,
    steps: {
        selectOneTerm: 'Velg et ledd.', 
        selectFactorInNumerator: 'Velg en faktor i telleren.',
        selectFactorInDenominator: 'Velg en faktor i nevneren.',
        selectTopLevelFactor: 'Velg et ledd eller en faktor i et ledd.',
        selectNumber: 'Velg et tall.',
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
            steps:['selectTopLevelFactor'],
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
