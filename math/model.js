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
    svg: {
        path: 'M 0.1 5.8787 q 0 -2.3974 1.6946 -4.0841 q 1.6946 -1.6946 4.0841 -1.6946 q 1.7805 0 3.1783 0.9371 q 1.3978 0.9293 2.1631 2.6316 l 1.1323 -1.3041 l -0.5076 3.8186 l -3.0533 -2.3427 q 1.3822 0.2968 1.718 0.125 l -0.2108 -0.4451 q -1.4915 -2.6551 -4.4121 -2.6551 q -2.0772 0 -3.5453 1.4681 q -1.4681 1.4681 -1.4681 3.5453 z m 8.7 2 h -6.1288 v -0.8268 h 6.1288 z m 0 2.1704 h -6.1288 v -0.8268 h 6.1288 z',
        viewBox: {
            width: 12.5,
            height: 10.5,
        }
    },
    description: 'Flytte ledd til den andre siden av ligningen',
    levels: {
        first: 4,
    }
};

model.mathOperations[divideBothSides.name] = {
    steps: ['selectTopLevelFactor'],
    icon: '|÷',
    svg: {
        path: 'M 0.5796 5.4688 h -0.4796 v -5.3688 h 0.4796 z m 3 -2.6 h -1.7198 v -0.4989 h 1.7198 z m -0.6 -0.8 h -0.5 v -0.4989 h 0.5 z  m 0 1.6 h -0.5 v -0.4989 h 0.5 z',
        viewBox: {
            width: 3.5,
            height: 5.5,
        }
    },
    description: 'Dele begge sider av ligningen',
    levels: {
        first: 5,
    }
};

model.mathOperations[reduceFraction.name] = {
    steps: ['selectFactorInNumerator', 'selectFactorInDenominator'],
    icon: '/\n‒\n/',
    svg: {
        path: 'M 10 1 l -3.7052 9.6118 h -0.894 l 3.6897 -9.6118 z m 3 12 h -12 v -0.8268 h 12 z m -3 1.3 l -3.7052 9.6118 h -0.894 l 3.6897 -9.6118 z',
        viewBox: {
            width: 14,
            height: 24,
        }
    },
    description: 'Forkorte brøk',
    levels: {
        first: 5,
    }
};

model.mathOperations[primeFactorize.name] = {
    steps: ['selectNumber'],
    icon: '□\n⭩⭨\n□×□',
    svg: {
        path: 'm 6.2 0.1 h 4.8782 v 4.8782 h -4.8782 z m 0.3927 0.3927 v 4.0928 h 4.0928 v -4.0928 z m -4 10.5 v -2.7027 l 1.08 1.08 l 4.0566 -4.0566 l 0.5426 0.5426 l -4.0566 4.0566 l 1.08 1.08 z m 12 0 v -2.7027 l -1.08 1.08 l -4.0566 -4.0566 l -0.5426 0.5426 l 4.0566 4.0566 l -1.08 1.08 z m -14.4 0.4 h 4.8782 v 4.8782 h -4.8782 z m 0.3927 0.3927 v 4.0928 h 4.0928 v -4.0928 z m 11.5 -0.376 h 4.8782 v 4.8782 h -4.8782 z m 0.3927 0.3927 v 4.0928 h 4.0928 v -4.0928 z m -1.08 4.2 l -0.5736 0.5736 l -2.2531 -2.2738 l -2.2531 2.2738 l -0.5736 -0.5736 l 2.2738 -2.2531 l -2.2738 -2.2531 l 0.5736 -0.5736 l 2.2531 2.2738 l 2.2531 -2.2738 l 0.5736 0.5736 l -2.2738 2.2531 z',
        viewBox: {
            width: 17,
            height: 17,
        }
    },
    description: 'Primtallsfaktorisere',
    levels: {
        first: 6,
    }
};

model.mathOperations[undo.name] = {
    steps: [],
    icon: '^⮪',
    svg: {
        path: 'm 0.1 2.2 l 2.0826 -2.0877 v 1.0697 h 2.7182 q 1.4624 0 2.0671 0.4651 q 0.4651 0.3514 0.6201 0.8268 q 0.1602 0.4703 0.1602 1.5038 v 1.0284 h -0.2532 v -0.1395 q 0 -0.9302 -0.4341 -1.2867 q -0.4289 -0.3617 -1.5451 -0.3617 h -3.3331 v 1.0697 z',
        viewBox: {
            width: 8,
            height: 5,
        }
    },
    description: 'Angre',
    levels: {
        first: 0,
    }
};

model.mathOperations[redo.name] = {
    steps: [],
    icon: '^⮫',
    svg: {
        path: 'm 7.8 2.2 l -2.0877 2.0877 v -1.0697 h -3.328 q -1.1214 0 -1.5503 0.3617 q -0.4289 0.3566 -0.4289 1.2867 v 0.1395 h -0.2532 v -1.0284 q 0 -1.0335 0.155 -1.5038 q 0.1602 -0.4754 0.6201 -0.8268 q 0.6046 -0.4651 2.0671 -0.4651 h 2.7182 v -1.0697 z',
        viewBox: {
            width: 8,
            height: 5,
        }
    },
    description: 'Gjøre omigjen',
    levels: {
        first: 0,
    }
};

