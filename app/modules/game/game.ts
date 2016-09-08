import Round from '../round/round';
import Controller from '../controller/controller';
import Promise from '../../third-party/bluebird-fix';
import Question from '../questions/question';

export default class Game {
    private static INITIAL_MONEY = 100;
    private static INITIAL_MINIMAL_BET = 10;
    private static MINIMAL_BET_INCREASE_PER_ROUND = 50;
    private static NUMBER_OF_QUESTIONS_PER_ROUND = 10;

    private roundNumber = 0;
    private currentRound:Round;
    private playerMoney = Game.INITIAL_MONEY;
    private currentBet = 0;

    constructor(private playerName:string) {

    }

    start() {
        this.roundNumber = 0;
        this.playerMoney = Game.INITIAL_MONEY;
        this.currentRound = new Round(Game.INITIAL_MINIMAL_BET);
        this.getNextQuestion();
    }

    canPlayerContinuePlaying():boolean {
        return this.playerMoney > 0;
    }

    getNextQuestion():Question {
        if (this.currentRound.getQuestionNumber() > Game.NUMBER_OF_QUESTIONS_PER_ROUND - 1) {
            this.nextRound();
        }

        return this.currentRound.getNextQuestion();
    }

    nextRound() {
        this.roundNumber++;
        this.currentRound = new Round(Game.getMinimalBetForRound(this.roundNumber));
    }

    private static getMinimalBetForRound(round:number) {
        return Game.INITIAL_MINIMAL_BET + Game.MINIMAL_BET_INCREASE_PER_ROUND * round;
    };

    getPlayerName():string {
        return this.playerName;
    }

    getPlayerMoney():number {
        return this.playerMoney;
    }

    getCurrentBet():number {
        return this.currentBet;
    }

    setCurrentBet(currentBet:number) {
        this.currentBet = currentBet;
    }

    questionAnswered(answer:boolean):boolean {
        const question = this.currentRound.getCurrentQuestion();
        const wasAnswerCorrect = question.getIsDefinitionCorrect() === answer;

        if (wasAnswerCorrect) {
            this.playerMoney += answer ? this.currentBet*3 : this.currentBet*2;
        } else {
            this.playerMoney -= this.currentBet;
        }

        return wasAnswerCorrect;
    }

    getCurrentMinimalBet() {
        return Game.getMinimalBetForRound(this.roundNumber);
    }

    isBetValid(bet:number) {
        return bet <= this.playerMoney && bet >= this.getCurrentMinimalBet();
    }
}
