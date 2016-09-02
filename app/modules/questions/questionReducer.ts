interface ICurrentQuestionState {
    id: number;
    word: string;
    definition: string;
    isDefinitionCorrect: boolean;
}

const INITIAL_STATE: ICurrentQuestionState = {
    id: 0,
    word: '',
    definition: '',
    isDefinitionCorrect: true
};

export default function questionReducer(currentQuestionState:ICurrentQuestionState = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return currentQuestionState;
    }
}
