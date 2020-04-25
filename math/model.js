const model = {
    level: 0,
    mathText: null,
    steps: {
        selectOneTerm: 'Velg et ledd.',
        selectFactorInNumerator: 'Velg en faktor i telleren.',
        selectFactorInDenominator: 'Velg en faktor i nevneren.',
        selectTopLevelFactor: 'Velg et ledd eller en faktor i et ledd.',
        selectNumber: 'Velg et tall.',
    },
    mathOperations: {
        mergeTerms: {
            steps: ['selectOneTerm', 'selectOneTerm'],
            icon: '∑',//'⭨⭩\n•',
            description: 'Slå sammen ledd',
            levels: {
                first: 1,
            }
        },
        subtractTermOnBothSides: {
            steps: ['selectOneTerm'],
            icon: '|&minus;',
            description: 'Trekke fra på begge sider av ligningen',
            levels: {
                first: 2,
                last: 2,
            }
        },
        moveTermToOtherSide: {
            steps: ['selectOneTerm'],
            icon: '↷\n=',
            description: 'Flytte ledd til den andre siden av ligningen',
            levels: {
                first: 3,
            }
        },
        divideBothSides: {
            steps: ['selectTopLevelFactor'],
            icon: '|÷',
            description: 'Dele begge sider av ligningen',
            levels: {
                first: 4,
            }
        },
        reduceFraction: {
            steps: ['selectFactorInNumerator', 'selectFactorInDenominator'],
            icon: '/\n‒\n/',
            description: 'Forkorte brøk',
            levels: {
                first: 5,
            }
        },        
        primeFactorize: {
            steps: ['selectNumber'],
            icon: '□\n⭩⭨\n□×□',
            description: 'Primtallsfaktorisere',
            levels: {
                first: 6,
            }
        },
    },
};
