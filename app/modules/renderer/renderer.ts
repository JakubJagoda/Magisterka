import Promise from '../../bluebird-fix';
import Stage = createjs.Stage;
import Container = createjs.Container;
import Controller from '../controller/controller';
import Question from '../questions/question';
import EventListener from '../eventListener/eventListener'

export default class Renderer extends EventListener<UserEvents> {
    private stage:Stage;

    constructor() {
        super();
        this.stage = new Stage('main');
        createjs.Ticker.on('tick', () => {
            this.stage.update();
        });
    }

    askPlayerForName():Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const name = prompt('Please type yur name');
            if (!name) {
                reject();
            } else {
                resolve(name);
            }
        });
    }

    askPlayerForBet(minimalBet:number):Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let bet:number;
            do {
                bet = Number(prompt('Place your bet', minimalBet.toString()));
            } while (bet < minimalBet);

            resolve(bet);
        });
    }

    renderView(view:GameViews, viewArgs?: any):void {
        this.stage.removeAllChildren();
        let newContainer:createjs.Container;

        switch (view) {
            case GameViews.MAIN_MENU:
                newContainer = this.renderMainMenu();
                break;

            case GameViews.QUESTION_PANEL:
                newContainer = this.renderQuestion(viewArgs);
                break;
        }

        this.stage.addChild(newContainer);
    }

    private renderMainMenu():Container {
        const container = new Container();

        const gameTitle = new createjs.Text('GameTitle');
        gameTitle.color = '#000';
        container.addChild(gameTitle);

        const startButton = new createjs.Container();
        const startButtonRect = new createjs.Graphics().beginFill('red').drawRect(0, 0, 50, 30);
        const startButtonBg = new createjs.Shape(startButtonRect);
        const startText = new createjs.Text('Start');
        startText.color = '#000';
        startButton.addChild(startButtonBg);
        startButton.addChild(startText);
        container.addChild(startButton);
        startButton.set({
            x: 100,
            y: 100
        });

        startButton.on('click', () => {
            this.dispatch(UserEvents.MAIN_MENU__NEW_GAME_CLICKED);
        });

        return container;
    }

    private renderQuestion({question, bet} : {question:Question, bet:number}):Container {
        const container = new Container();

        const wordText = new createjs.Text(question.getWord());
        wordText.set({
            x: 20,
            y: 0
        });
        const definitionText = new createjs.Text(question.getDefinition());
        definitionText.set({
            x: 20,
            y: 40
        });
        container.addChild(wordText);
        container.addChild(definitionText);

        const trueButton = new createjs.Container();
        const trueButtonRect = new createjs.Graphics().beginFill('green').drawRect(0, 0, 50, 30);
        const trueButtonBg = new createjs.Shape(trueButtonRect);
        const trueText = new createjs.Text('True');
        trueText.color = '#000';
        trueButton.addChild(trueButtonBg);
        trueButton.addChild(trueText);
        container.addChild(trueButton);
        trueButton.set({
            x: 100,
            y: 100
        });

        trueButton.on('click', () => {
            this.dispatch(UserEvents.QUESTION_PANEL__TRUE_CLICKED);
        });

        const falseButton = new createjs.Container();
        const falseButtonRect = new createjs.Graphics().beginFill('red').drawRect(0, 0, 50, 30);
        const falseButtonBg = new createjs.Shape(falseButtonRect);
        const falseText = new createjs.Text('False');
        falseText.color = '#000';
        falseButton.addChild(falseButtonBg);
        falseButton.addChild(falseText);
        container.addChild(falseButton);
        falseButton.set({
            x: 200,
            y: 100
        });

        falseButton.on('click', () => {
            this.dispatch(UserEvents.QUESTION_PANEL__FALSE_CLICKED);
        });
        
        return container;
    }
}
