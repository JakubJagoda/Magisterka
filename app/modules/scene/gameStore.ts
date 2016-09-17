import Store from '../flux/store';
import {IDispatcherPayload} from "../flux/dispatcher";
import {
    SetPlayerNameAction, BeginRoundAction, RequestForBetAction, PlaceBetAction,
    AnswerQuestionAction
} from "./sceneActions";
import Question from "../questions/question";

export const enum SCENE_STATES {
    NAME_INPUT,
    PLAYER_GREETING,
    ROUND_INTRO,
    PLACING_BET,
    QUESTION,
    QUESTION_AFTERMATHS,
    PLAYER_LOSE,
    PLAYER_WIN
}

export interface IGameState {
    playerName: string;
    playerMoney: number;
    currentGameState: SCENE_STATES;
    currentRound: number;
    currentBet: number;
    currentQuestion: Question;
    previousAnswer: boolean;
    wasPreviousAnswerCorrect: boolean;
}

class GameStore extends Store {
    private playerName: string = '';
    private playerMoney: number = 100;
    private currentGameState: SCENE_STATES = SCENE_STATES.NAME_INPUT;
    private currentRound: number = 0;
    private currentBet: number = 0;
    private currentQuestion: Question = Question.getQuestion();
    private previousAnswer = true;
    private wasPreviousAnswerCorrect = true;

    protected onDispatch(payload: IDispatcherPayload): Promise<void> {
        const action = payload.action;

        if (action instanceof SetPlayerNameAction) {
            this.playerName = action.name;
            this.currentGameState = SCENE_STATES.PLAYER_GREETING;
        } else if (action instanceof BeginRoundAction) {
            this.currentRound = action.round;
            this.currentGameState = SCENE_STATES.ROUND_INTRO;
        } else if (action instanceof RequestForBetAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET
        } else if (action instanceof PlaceBetAction) {
            this.currentBet = action.bet;
            this.currentQuestion = Question.getQuestion(this.currentRound);
            this.currentGameState = SCENE_STATES.QUESTION;
        } else if (action instanceof AnswerQuestionAction) {
            if (this.currentQuestion.getIsDefinitionCorrect() != action.answer) {
                this.wasPreviousAnswerCorrect = false;
                this.playerMoney -= this.currentBet;
            } else if (this.currentQuestion.getIsDefinitionCorrect()) {
                this.wasPreviousAnswerCorrect = true;
                this.playerMoney += this.currentBet * 2;
            } else {
                this.wasPreviousAnswerCorrect = true;
                this.playerMoney += this.currentBet * 3;
            }

            this.previousAnswer = action.answer;
            this.currentGameState = SCENE_STATES.QUESTION_AFTERMATHS;
        } else {
            return;
        }

        this.emitChange();
    }

    public getGameState():IGameState {
        return {
            playerName: this.playerName,
            playerMoney: this.playerMoney,
            currentGameState: this.currentGameState,
            currentRound: this.currentRound,
            currentBet: this.currentBet,
            currentQuestion: this.currentQuestion,
            previousAnswer: this.previousAnswer,
            wasPreviousAnswerCorrect: this.wasPreviousAnswerCorrect
        };
    }
}

const gameStore = new GameStore();
export default gameStore;