import Promise from '../../third-party/bluebird-fix';
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
        this.stage.enableMouseOver();
        createjs.Ticker.on('tick', () => {
            this.stage.update();
        });
    }

    askPlayerForName():Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const name = prompt('Please type your name');
            if (!name) {
                reject();
            } else {
                resolve(name);
            }
        });
    }

    askPlayerForBet(minimalBet:number, currentMoney:number):Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let bet:number;
            do {
                bet = Number(prompt(`Place your bet (you have ${currentMoney}$ currently)`, minimalBet.toString()));
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

    private static createJSButton(size: {width: number; height: number}, text: string, bgColor: string):createjs.Container {
        const button = new createjs.Container();

        const buttonRect = new createjs.Graphics().beginFill(bgColor).drawRect(0, 0, size.width, size.height);
        const buttonBg = new createjs.Shape(buttonRect);

        const buttonText = new createjs.Text(text);
        buttonText.color = '#000';

        button.addChild(buttonBg);
        button.addChild(buttonText);

        const bounds = buttonText.getBounds();
        buttonText.set({
            x: (size.width - bounds.width)/2,
            y: (size.height - bounds.height)/2
        });

        button.cursor = 'pointer';

        return button;
    }

    private renderMainMenu():Container {
        const container = new Container();

        const gameTitle = new createjs.Text('GameTitle');
        gameTitle.color = '#000';
        container.addChild(gameTitle);

        const startButton = Renderer.createJSButton({width: 50, height: 30}, 'Start', 'red');
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

        const wordText = new createjs.Text(`Word: ${question.getWord()}`);
        wordText.set({
            x: 20,
            y: 0
        });
        const definitionText = new createjs.Text(`Definition: ${question.getDefinition()}`);
        definitionText.set({
            x: 20,
            y: 20
        });
        container.addChild(wordText);
        container.addChild(definitionText);

        const betText = new createjs.Text(`Your bet: ${bet}$`);
        betText.set({
            x: 20,
            y: 40
        });
        container.addChild(betText);

        const trueButton = Renderer.createJSButton({width: 50, height: 30}, 'True', 'green');
        container.addChild(trueButton);
        trueButton.set({
            x: 100,
            y: 100
        });

        trueButton.on('click', () => {
            this.dispatch(UserEvents.QUESTION_PANEL__TRUE_CLICKED);
        });

        const falseButton = Renderer.createJSButton({width: 50, height: 30}, 'False', 'red');
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

    informPlayerIfTheAnswerWasCorrect(wasCorrect:boolean) {
        const text = wasCorrect ? 'Correct!' : 'Sorry, wrong!';
        alert(text);
    }

    displayLoseMessage() {
        alert(`You lost!`);
    }
}
