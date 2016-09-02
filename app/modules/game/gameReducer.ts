const enum GAME_ACTIONS {
    NEW_GAME,
    SET_BET,
    ANSWER_QUESTION
}

interface IGameState {
    bet: number;
    roundNumber: number;
    questionNumber: number;
    playerMoney: number;
}

interface ISetBetActionData {
    newBet: number;
}

interface IAnswerQuestionActionData {
    answer: boolean;
    isDefinitionCorrect: boolean;
}

interface IGameAction extends IAction {
    data: ISetBetActionData|IAnswerQuestionActionData;
}

function computeReward(answer: boolean, isDefinitionCorrect: boolean, bet: number): number {
    if (answer === true && isDefinitionCorrect === true) {
        return bet * 2;
    } else if (answer === false && isDefinitionCorrect === false) {
        return bet * 3;
    } else {
        return -1 * bet;
    }
}

const INITIAL_STATE: IGameState = {
    bet: 0,
    roundNumber: 1,
    questionNumber: 1,
    playerMoney: 1000,
};

export default function gameReducer(gameState: IGameState = INITIAL_STATE, action: IGameAction): IGameState {
    switch (action.type) {
        case GAME_ACTIONS.NEW_GAME:
            return INITIAL_STATE;

        case GAME_ACTIONS.SET_BET:
            return Object.assign({}, gameState, {
                bet: (<ISetBetActionData>action.data).newBet,
            });

        case GAME_ACTIONS.ANSWER_QUESTION:
            const actionData = <IAnswerQuestionActionData>action.data;
            const reward = computeReward(actionData.answer, actionData.isDefinitionCorrect, gameState.bet);
            const newPlayerMoney = gameState.playerMoney + reward;

            return Object.assign({}, gameState, {
                playerMoney: newPlayerMoney
            });

        default:
            return gameState;
    }
}
