import React from 'react';
import './scene.style';

import dispatcher from '../flux/dispatcher';
import {
    SetPlayerNameAction, BeginRoundAction, RequestForBetAction, PlaceBetAction,
    AnswerQuestionAction, QuestionResultShown, FinalScoreShown
} from './sceneActions';
import {default as gameStore, SCENE_STATES, IGameState} from './gameStore';

import PlayerNameForm from '../playerNameForm/playerNameForm';
import RoundIntro from "../roundIntro/roundIntro";
import PlaceBetForm from "../placeBetForm/placeBetForm";
import QuestionPanel from "../questionPanel/questionPanel";
import GameOver from "../gameOver/gameOver";

interface ISceneState extends IGameState {}

class Scene extends React.Component<{},ISceneState> {
    private boundGameStoreUpdateHandler;

    constructor() {
        super();

        this.state = gameStore.getGameState();
        this.boundGameStoreUpdateHandler = this.onGameStoreChange.bind(this);
    }

    render() {
        return (
            <div className='scene'>
                {this.renderSceneComponent()}
            </div>
        );
    }

    private renderSceneComponent() {
        switch(this.state.currentGameState) {
            case SCENE_STATES.NAME_INPUT:
                return (
                    <PlayerNameForm onNameEntered={Scene.handleNameEntered} />
                );

            case SCENE_STATES.PLAYER_GREETING:
                return (
                    <PlayerNameForm playerName={this.state.playerName} onGreetingsGone={Scene.handleNameFormClosed} />
                );

            case SCENE_STATES.ROUND_INTRO:
                return (
                    <RoundIntro currentRound={this.state.currentRound} onIntroFaded={Scene.handleRoundIntroFaded} />
                );

            case SCENE_STATES.PLACING_BET:
                return (
                    <PlaceBetForm minBet={10} maxBet={this.state.playerMoney} currentPlayerMoney={this.state.playerMoney}
                                  onBetEntered={Scene.handleBetEntered} />
                );

            case SCENE_STATES.QUESTION:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()} definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   onTruthSelected={Scene.handleQuestionAnswered.bind(null, true)}
                                   onBunkSelected={Scene.handleQuestionAnswered.bind(null, false)} />
                );

            case SCENE_STATES.ANSWER_RESULTS:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()} definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   answerToCurrentQuestion={this.state.answerToCurrentQuestion}
                                   isAnswerToCurrentQuestionCorrect={this.state.isAnswerToCurrentQuestionCorrect}
                                   onResultShown={Scene.handleQuestionResultShown} />
                );

            case SCENE_STATES.PLAYER_LOSE:
                return (
                    <GameOver didPlayerWin={false} playerMoney={this.state.playerMoney}
                              onScoreShown={Scene.handleFinalScoreShown}  />
                );

            case SCENE_STATES.PLAYER_WIN:
                return (
                    <GameOver didPlayerWin={true} playerMoney={this.state.playerMoney}
                              onScoreShown={Scene.handleFinalScoreShown}  />
                );

            default:
                return null;
        }
    }

    componentDidMount() {
        gameStore.addListener(this.boundGameStoreUpdateHandler);
    }

    componentWillUnmount() {
        gameStore.removeListener(this.boundGameStoreUpdateHandler);
    }

    private static handleNameEntered(playerName: string) {
        dispatcher.handleViewAction({
            action: new SetPlayerNameAction(playerName)
        });
    }

    private static handleNameFormClosed() {
        const INITIAL_ROUND_NUMBER = 0;
        dispatcher.handleViewAction({
            action: new BeginRoundAction(INITIAL_ROUND_NUMBER)
        });
    }

    private static handleRoundIntroFaded() {
        dispatcher.handleViewAction({
            action: new RequestForBetAction()
        });
    }

    private static handleBetEntered(bet: number) {
        dispatcher.handleViewAction({
            action: new PlaceBetAction(bet)
        });
    }

    private static handleQuestionAnswered(answer: boolean) {
        dispatcher.handleViewAction({
            action: new AnswerQuestionAction(answer)
        });
    }

    private static handleQuestionResultShown() {
        dispatcher.handleViewAction({
            action: new QuestionResultShown()
        });
    }

    private static handleFinalScoreShown() {
        dispatcher.handleViewAction({
            action: new FinalScoreShown()
        });
    }

    private onGameStoreChange() {
        const gameState = gameStore.getGameState();

        this.setState(Object.assign({}, this.state, gameState));
    }
}

export default Scene;
