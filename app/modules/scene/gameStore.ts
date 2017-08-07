import Store from '../flux/store';
import {IDispatcherPayload} from "../flux/dispatcher";
import {
    SetPlayerNameAction, BeginRoundAction, RequestForBetAction, PlaceBetAction,
    AnswerQuestionAction, QuestionResultShownAction, FinalScoreShownAction, QuestionsLoadedAction, QuestionShownAction
} from "./sceneActions";
import * as Puzzles from "../puzzles/puzzles";

type Question = Puzzles.Question;

export const enum SCENE_STATES {
    NAME_INPUT,
    PLAYER_GREETING,
    ROUND_INTRO,
    PLACING_BET,
    QUESTION,
    ANSWER_RESULTS,
    PLAYER_LOSE,
    PLAYER_WIN,
    WAITING_FOR_QUESTIONS
}

export interface IGameState {
    playerName: string;
    playerMoney: number;
    currentGameState: SCENE_STATES;
    currentRound: number;
    currentBet: number;
    currentQuestion: Question;
    currentQuestionNumberInRound: number;
    answerToCurrentQuestion: boolean;
    isAnswerToCurrentQuestionCorrect: boolean;
}

class GameStore extends Store {
    private playerName = '';
    private playerMoney = 100;
    private currentGameState: SCENE_STATES = SCENE_STATES.WAITING_FOR_QUESTIONS;
    private currentRound = 0;
    private currentBet = 0;
    private currentQuestion: Question = null;
    private currentQuestionNumberInRound = 0;
    private answerToCurrentQuestion = true;
    private isAnswerToCurrentQuestionCorrect = true;
    private questionShownTime: Date = null;

    private static MAX_ROUNDS_COUNT = 4;
    private static MAX_QUESTIONS_PER_ROUND_COUNT = 10;

    protected onDispatch(payload: IDispatcherPayload) {
        const action = payload.action;

        if (action instanceof QuestionsLoadedAction) {
            this.currentGameState = SCENE_STATES.NAME_INPUT;
            this.currentQuestion = Puzzles.getQuestion(this.currentRound);
        } else if (action instanceof SetPlayerNameAction) {
            this.playerName = action.name;
            this.currentGameState = SCENE_STATES.PLAYER_GREETING;
        } else if (action instanceof BeginRoundAction) {
            this.currentRound = action.round;
            this.currentQuestionNumberInRound = 0;
            this.currentGameState = SCENE_STATES.ROUND_INTRO;
        } else if (action instanceof RequestForBetAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET
        } else if (action instanceof PlaceBetAction) {
            this.currentBet = action.bet;
            this.currentQuestion = Puzzles.getQuestion(this.currentRound);
            this.currentGameState = SCENE_STATES.QUESTION;
        } else if (action instanceof QuestionShownAction) {
            this.questionShownTime = new Date();
        } else if (action instanceof AnswerQuestionAction) {
            if (this.currentQuestion.getIsDefinitionCorrect() != action.answer) {
                this.isAnswerToCurrentQuestionCorrect = false;
                this.playerMoney -= this.currentBet;
            } else if (this.currentQuestion.getIsDefinitionCorrect()) {
                this.isAnswerToCurrentQuestionCorrect = true;
                this.playerMoney += this.currentBet * 2;
            } else {
                this.isAnswerToCurrentQuestionCorrect = true;
                this.playerMoney += this.currentBet * 3;
            }

            this.answerToCurrentQuestion = action.answer;

            const answer = Puzzles.Answer.fromPlainAnswer({
                selectedAnswer: action.answer,
                correctAnswer: this.currentQuestion.getIsDefinitionCorrect(),
                contentID: this.currentQuestion.getContentID(),
                reported: false,
                timeForAnswerInMs: (new Date()).getTime() - this.questionShownTime.getTime(),
                dateTime: new Date()
            });

            Puzzles.saveAnswer(answer);

            this.currentGameState = SCENE_STATES.ANSWER_RESULTS;
        } else if (action instanceof QuestionResultShownAction) {
            if (this.playerMoney <= 0) {
                this.currentGameState = SCENE_STATES.PLAYER_LOSE;
            } else {
                this.currentQuestionNumberInRound++;

                if (this.currentQuestionNumberInRound >= GameStore.MAX_QUESTIONS_PER_ROUND_COUNT) {
                    this.currentRound++;
                    this.currentQuestionNumberInRound = 0;

                    if (this.currentRound >= GameStore.MAX_ROUNDS_COUNT) {
                        this.currentGameState = SCENE_STATES.PLAYER_WIN;
                    } else {
                        this.currentGameState = SCENE_STATES.ROUND_INTRO;
                    }
                } else {
                    this.currentGameState = SCENE_STATES.PLACING_BET;
                }
            }
        } else if (action instanceof FinalScoreShownAction) {
            this.resetGameStateToDefaults();
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
            currentQuestionNumberInRound: this.currentQuestionNumberInRound,
            answerToCurrentQuestion: this.answerToCurrentQuestion,
            isAnswerToCurrentQuestionCorrect: this.isAnswerToCurrentQuestionCorrect
        };
    }

    private resetGameStateToDefaults() {
        this.playerName = '';
        this.playerMoney = 100;
        this.currentGameState = SCENE_STATES.NAME_INPUT;
        this.currentRound = 0;
        this.currentBet = 0;
        this.currentQuestionNumberInRound = 0;
        this.answerToCurrentQuestion = true;
        this.isAnswerToCurrentQuestionCorrect = true;
    }
}

const gameStore = new GameStore();
export default gameStore;