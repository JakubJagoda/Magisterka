import Store from '../flux/store';
import {IDispatcherPayload} from "../flux/dispatcher";
import {
    SetPlayerNameAction, BeginRoundAction, RequestForBetAction, PlaceBetAction,
    AnswerQuestionAction, QuestionResultShownAction, FinalScoreShownAction, QuestionsLoadedInitialAction,
    QuestionShownAction,
    QuestionTimeoutAction, QuestionsLoadedAction, ShowReportQuestionFormAction, ReportQuestionAction,
    FinishedReportingQuestionAction
} from "./sceneActions";
import * as Puzzles from "../puzzles/puzzles";
import {EAnswerType} from "../puzzles/puzzles";

type Question = Puzzles.Question;
type Answer = Puzzles.Answer;

export const enum SCENE_STATES {
    NAME_INPUT,
    PLAYER_GREETING,
    ROUND_INTRO,
    PLACING_BET,
    QUESTION,
    ANSWER_RESULTS,
    PLAYER_LOSE,
    PLAYER_WIN,
    WAITING_FOR_QUESTIONS,
    REPORT_QUESTION
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
    answerType: EAnswerType;
    difficultyLevelsWithNoQuestionsLeft: number[];
    canReportPreviousQuestion: boolean;
    reportedQuestionInCurrentRound: boolean;
    previousQuestion: Question;
    previousAnswer: Answer;
}

// @TODO there should be a separate store for questions
class GameStore extends Store {
    private playerName = '';
    private playerMoney = 100;
    private currentGameState: SCENE_STATES = SCENE_STATES.WAITING_FOR_QUESTIONS;
    private currentRound = 0;
    private currentBet = 0;
    private currentQuestion: Question = null;
    private currentQuestionNumberInRound = 0;
    private answerToCurrentQuestion = true;
    private answerType: EAnswerType = null;
    private isAnswerToCurrentQuestionCorrect = true;
    private questionShownTime: Date = null;
    private difficultyLevelsWithNoQuestionsLeft: number[] = [];
    private canReportPreviousQuestion = false;
    private reportedQuestionInCurrentRound = false;
    private previousQuestion: Question = null;
    private previousAnswer: Answer = null;

    private static MAX_ROUNDS_COUNT = 4;
    private static MAX_QUESTIONS_PER_ROUND_COUNT = 10;

    protected onDispatch(payload: IDispatcherPayload) {
        const action = payload.action;

        if (action instanceof QuestionsLoadedInitialAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET;
            this.currentQuestion = Puzzles.getQuestion(this.currentRound);
        } else if (action instanceof SetPlayerNameAction) {
            this.playerName = action.name;
            this.currentGameState = SCENE_STATES.PLAYER_GREETING;
        } else if (action instanceof BeginRoundAction) {
            this.currentRound = action.round;
            this.reportedQuestionInCurrentRound = false;
            this.currentQuestionNumberInRound = 0;
            this.currentGameState = SCENE_STATES.ROUND_INTRO;
        } else if (action instanceof RequestForBetAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET
        } else if (action instanceof PlaceBetAction) {
            this.currentBet = action.bet;

            if (this.difficultyLevelsWithNoQuestionsLeft.includes(this.currentRound)) {
                this.currentGameState = SCENE_STATES.WAITING_FOR_QUESTIONS;
            } else {
                this.currentQuestion = Puzzles.getQuestion(this.currentRound);
                this.currentGameState = SCENE_STATES.QUESTION;
            }
        } else if (action instanceof QuestionShownAction) {
            this.questionShownTime = new Date();
        } else if (action instanceof AnswerQuestionAction) {
            if ((this.currentQuestion.getCorrectAnswer() === EAnswerType.TRUTH && action.answer === EAnswerType.BUNK) ||
                (this.currentQuestion.getCorrectAnswer() === EAnswerType.BUNK && action.answer === EAnswerType.TRUTH)) {
                this.isAnswerToCurrentQuestionCorrect = false;
                this.playerMoney -= this.currentBet;
                this.canReportPreviousQuestion = !this.reportedQuestionInCurrentRound;
            } else if (this.currentQuestion.getCorrectAnswer() === EAnswerType.TRUTH && action.answer === EAnswerType.TRUTH) {
                this.isAnswerToCurrentQuestionCorrect = true;
                this.playerMoney += this.currentBet * 2;
                this.canReportPreviousQuestion = false;
            } else {
                this.isAnswerToCurrentQuestionCorrect = true;
                this.playerMoney += this.currentBet * 3;
                this.canReportPreviousQuestion = false;
            }

            this.answerType = action.answer;

            const answer = Puzzles.Answer.fromPlainAnswer({
                selectedAnswer: action.answer,
                correctAnswer: this.currentQuestion.getCorrectAnswer(),
                contentID: this.currentQuestion.getContentID(),
                reported: false,
                timeForAnswerInMs: (new Date()).getTime() - this.questionShownTime.getTime(),
                dateTime: new Date()
            });

            Puzzles.saveAnswer(answer);
            this.difficultyLevelsWithNoQuestionsLeft = Puzzles.getDifficultyLevelsWithNoQuestionsLeft();
            this.previousQuestion = this.currentQuestion;
            this.previousAnswer = answer;

            this.currentGameState = SCENE_STATES.ANSWER_RESULTS;
        } else if(action instanceof QuestionTimeoutAction) {
            this.isAnswerToCurrentQuestionCorrect = false;
            this.answerType = EAnswerType.TIMEOUT;
            this.playerMoney -= this.currentBet;

            const answer = Puzzles.Answer.fromPlainAnswer({
                selectedAnswer: EAnswerType.TIMEOUT,
                correctAnswer: this.currentQuestion.getCorrectAnswer(),
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
        } else if (action instanceof QuestionsLoadedAction) {
            this.difficultyLevelsWithNoQuestionsLeft = [];
            if (this.currentGameState === SCENE_STATES.WAITING_FOR_QUESTIONS) {
                this.currentQuestion = Puzzles.getQuestion(this.currentRound);
                this.currentGameState = SCENE_STATES.QUESTION;
            }
        } else if (action instanceof ShowReportQuestionFormAction) {
            this.currentGameState = SCENE_STATES.REPORT_QUESTION;
        } else if (action instanceof ReportQuestionAction) {
            this.canReportPreviousQuestion = false;
            this.reportedQuestionInCurrentRound = true;
            this.playerMoney += this.currentBet;
            this.currentQuestionNumberInRound -= 1;

            if (this.currentQuestionNumberInRound < 0) {
                this.currentQuestionNumberInRound = GameStore.MAX_QUESTIONS_PER_ROUND_COUNT - 1;
                this.currentRound -= 1;
            }

            Puzzles.reportAnswer(action.answerID);
        } else if (action instanceof FinishedReportingQuestionAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET;
        } else {
            return;
        }

        this.emitChange();
    }

    public getGameState():IGameState {
        return Object.getOwnPropertyNames(this).reduce((reduced, propertyName) => {
            const propertyValue = this[propertyName];

            if (Array.isArray(propertyValue)) {
                reduced[propertyName] = propertyValue.slice();
            } else {
                reduced[propertyName] = propertyValue;
            }

            return reduced;
        }, <IGameState>{});
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
        this.answerType = null;
        this.difficultyLevelsWithNoQuestionsLeft = [];
        this.canReportPreviousQuestion = false;
    }
}

const gameStore = new GameStore();
export default gameStore;