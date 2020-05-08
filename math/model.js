const 
const model = {
    level: 4,
    mathText: 'x+3=5',
    history: {
        items: [],
        index: 0,
    },    
    steps: {
        selectOneTerm: 'Velg et ledd.',
        selectFactorInNumerator: 'Velg en faktor i telleren.',
        selectFactorInDenominator: 'Velg en faktor i nevneren.',
        selectTopLevelFactor: 'Velg et ledd eller en faktor i et ledd.',
        selectNumber: 'Velg et tall.',
    },
    mathOperations: {
    },
};

model.mathOperations[mergeTerms.name] = {
    steps: ['selectOneTerm', 'selectOneTerm'],
    icon: '∑',//'⭨⭩\n•',
    description: 'Slå sammen ledd',
    levels: {
        first: 1,
    }
};

model.mathOperations[subtractTermOnBothSides.name] = {
    steps: ['selectOneTerm'],
    icon: '|&minus;',
    description: 'Trekke fra på begge sider av ligningen',
    levels: {
        first: 2,
        last: 3,
    }
};

model.mathOperations[moveTermToOtherSide.name] = {
    steps: ['selectOneTerm'],
    icon: '↷\n=',
    description: 'Flytte ledd til den andre siden av ligningen',
    levels: {
        first: 4,
    }
};

model.mathOperations[divideBothSides.name] = {
    steps: ['selectTopLevelFactor'],
    icon: '|÷',
    description: 'Dele begge sider av ligningen',
    levels: {
        first: 5,
    }
};

model.mathOperations[reduceFraction.name] = {
    steps: ['selectFactorInNumerator', 'selectFactorInDenominator'],
    icon: '/\n‒\n/',
    description: 'Forkorte brøk',
    levels: {
        first: 5,
    }
};

model.mathOperations[primeFactorize.name] = {
    steps: ['selectNumber'],
    icon: '□\n⭩⭨\n□×□',
    description: 'Primtallsfaktorisere',
    levels: {
        first: 6,
    }
};

model.mathOperations[undo.name] = {
    steps: [],
    icon: '^⮪',
    description: 'Angre',
    levels: {
        first: 0,
    }
};

model.mathOperations[redo.name] = {
    steps: [],
    icon: '^⮫',
    description: 'Gjøre omigjen',
    levels: {
        first: 0,
    }
};

