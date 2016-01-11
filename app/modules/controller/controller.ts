import Game from '../game/game';
import Renderer from '../renderer/renderer';
import Question from '../questions/question';

export default class Controller {
    private game:Game;
    private renderer:Renderer;

    constructor() {
        this.renderer = new Renderer();
        this.installEvents();
    }

    openMainMenu() {
        this.renderer.renderView(GameViews.MAIN_MENU);
    }

    async startNewGame() {
        const name = await this.askPlayerForName();
        this.game = new Game(this, name);
        this.game.start();
        this.nextQuestion();
    }

    async nextQuestion() {
        const question: Question = this.game.getNextQuestion();
        const bet = await this.askPlayerForBet(this.game.getCurrentMinimalBet());
        this.renderer.renderView(GameViews.QUESTION_PANEL, { question, bet });
    }

    private askPlayerForName():Promise<string> {
        return this.renderer.askPlayerForName();
    }

    askPlayerForBet(minimalBet:number):Promise<number> {
        return this.renderer.askPlayerForBet(minimalBet);
    }

    private installEvents():void {
        this.renderer.on(UserEvents.MAIN_MENU__NEW_GAME_CLICKED, () => this.startNewGame());
        this.renderer.on(UserEvents.QUESTION_PANEL__TRUE_CLICKED, () => this.handleQuestionAnswered(true));
        this.renderer.on(UserEvents.QUESTION_PANEL__FALSE_CLICKED, () => this.handleQuestionAnswered(false));
    }

    private handleQuestionAnswered(answer:boolean) {
        this.game.questionAnswered(answer);
        this.nextQuestion();
    }
}
