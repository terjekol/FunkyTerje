const model = {
    level: 1,
    mathText: 'x=1+2',
    ownExercise: '',
    showVideos: true,
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
    mathOperations: {},
    youTubeVideoIds: [
        '',
        '4yY3GJ2VJR8',
        'ppjutK7iwu8',
        'kPK-rbW7Jy8',
        'zAbQeidbWdc',
        'rgdP8DK9cQ8',
        'QejFqIPpos4',
    ],    
};

model.mathOperations[mergeTerms.name] = {
    steps: ['selectOneTerm', 'selectOneTerm'],
    icon: '∑',//'⭨⭩\n•',
    svg: {
        path: 'M 3.34 4.7 h -3.2577 v -0.5264 l 1.8548 -1.8411 l -1.8273 -1.7391 v -0.5181 h 3.1226 v 0.4851 h -2.4557 l 1.7859 1.6564 v 0.1984 l -1.8355 1.7997 h 2.6128 z',
        viewBox: {
            width: 3.34,
            height: 4.7,
        }
    },
    description: 'Slå sammen ledd',
    levels: {
        first: 1,
    }
};

model.mathOperations[subtractTermOnBothSides.name] = {
    steps: ['selectOneTerm'],
    icon: '|&minus;',
    svg: {
        path: 'M 0.5796 5.4688 h -0.4796 v -5.3688 h 0.4796 z m 3 -2.6 h -1.7198 v -0.4989 h 1.7198 z',
        viewBox: {
            width: 3.5,
            height: 5.5,
        }
    },
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

