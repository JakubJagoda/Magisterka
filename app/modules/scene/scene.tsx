import * as React from 'react';
import './scene.style';

import dispatcher from '../flux/dispatcher';
import {
    SetPlayerNameAction,
    BeginRoundAction,
    RequestForBetAction,
    PlaceBetAction,
    AnswerQuestionAction,
    QuestionResultShownAction,
    FinalScoreShownAction,
    QuestionsLoadedInitialAction,
    QuestionShownAction,
    QuestionTimeoutAction, QuestionsLoadedAction
} from './sceneActions';
import {SaveHighScoreAction} from '../highScores/highScoresActions';
import {default as gameStore, SCENE_STATES, IGameState} from './gameStore';
import * as Puzzles from '../puzzles/puzzles'

import PlayerNameForm from '../playerNameForm/playerNameForm';
import RoundIntro from "../roundIntro/roundIntro";
import PlaceBetForm from "../placeBetForm/placeBetForm";
import QuestionPanel, {EAnswerType} from "../questionPanel/questionPanel";
import GameOver from "../gameOver/gameOver";
import {hashHistory} from "react-router";

interface ISceneState extends IGameState {
}

class Scene extends React.Component<{}, ISceneState> {
    private boundGameStoreUpdateHandler: () => void;
    private static questionLevelsLoading: Set<number> = new Set<number>();

    constructor() {
        super();

        this.state = gameStore.getGameState();
        this.boundGameStoreUpdateHandler = this.onGameStoreChange.bind(this);

        Puzzles.loadInitialQuestionSet().then(() => {
            dispatcher.handleServerAction({
                action: new QuestionsLoadedInitialAction()
            });
        });
    }

    render() {
        return (
            <div className='scene'>
                {this.renderSceneComponent()}
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState: ISceneState) {
        return this.state.currentGameState !== nextState.currentGameState;
    }

    private renderSceneComponent() {
        switch (this.state.currentGameState) {
            case SCENE_STATES.NAME_INPUT:
                return (
                    <PlayerNameForm onNameEntered={Scene.handleNameEntered}/>
                );

            case SCENE_STATES.PLAYER_GREETING:
                return (
                    <PlayerNameForm playerName={this.state.playerName} onGreetingsGone={Scene.handleNameFormClosed}/>
                );

            case SCENE_STATES.ROUND_INTRO:
                return (
                    <RoundIntro currentRound={this.state.currentRound} onIntroFaded={Scene.handleRoundIntroFaded}/>
                );

            case SCENE_STATES.PLACING_BET:
                return (
                    <PlaceBetForm minBet={10} maxBet={this.state.playerMoney}
                                  currentPlayerMoney={this.state.playerMoney}
                                  onBetEntered={Scene.handleBetEntered}/>
                );

            case SCENE_STATES.QUESTION:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()}
                                   definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   onTruthSelected={Scene.handleQuestionAnswered.bind(null, EAnswerType.TRUTH)}
                                   onBunkSelected={Scene.handleQuestionAnswered.bind(null, EAnswerType.BUNK)}
                                   onQuestionTimeout={Scene.handleQuestionTimeout.bind(null)}
                                   onQuestionShown={Scene.handleQuestionShown.bind(null)}/>
                );

            case SCENE_STATES.ANSWER_RESULTS:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()}
                                   definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   answerToCurrentQuestion={this.state.answerToCurrentQuestion}
                                   isAnswerToCurrentQuestionCorrect={this.state.isAnswerToCurrentQuestionCorrect}
                                   answerType={this.state.answerType}
                                   onResultShown={Scene.handleQuestionResultShown}/>
                );

            case SCENE_STATES.PLAYER_LOSE:
                return (
                    <GameOver didPlayerWin={false} playerMoney={this.state.playerMoney}
                              onScoreShown={Scene.handleFinalScoreShown}/>
                );

            case SCENE_STATES.PLAYER_WIN:
                return (
                    <GameOver didPlayerWin={true} playerMoney={this.state.playerMoney}
                              onScoreShown={Scene.handleFinalScoreShown}/>
                );

            case SCENE_STATES.WAITING_FOR_QUESTIONS:
                return (
                    <div>Loading questions... If it takes too long, there might be a server issue</div>
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

    private static handleQuestionAnswered(answer: EAnswerType) {
        dispatcher.handleViewAction({
            action: new AnswerQuestionAction(answer)
        });
    }

    private static handleQuestionResultShown() {
        dispatcher.handleViewAction({
            action: new QuestionResultShownAction()
        });
    }

    private static handleFinalScoreShown() {
        const {playerName, playerMoney, currentRound} = gameStore.getGameState();
        dispatcher.handleViewAction({
            action: new SaveHighScoreAction(playerName, currentRound, playerMoney)
        });

        dispatcher.handleViewAction({
            action: new FinalScoreShownAction()
        });

        hashHistory.replace('/highscores');
    }

    private static handleQuestionShown() {
        dispatcher.handleViewAction({
            action: new QuestionShownAction()
        });
    }

    private static handleQuestionTimeout() {
        dispatcher.handleViewAction({
            action: new QuestionTimeoutAction()
        });
    }

    private static loadMoreQuestions(difficultyLevelsWithNoQuestionsLeft: number[]) {
        Promise.all(difficultyLevelsWithNoQuestionsLeft.map(level => {
            Scene.questionLevelsLoading.add(level);

            return Puzzles.loadQuestions(level)
                .then(() => {
                    Scene.questionLevelsLoading.delete(level);
                });
        })).then(() => {
            dispatcher.handleServerAction({
                action: new QuestionsLoadedAction()
            });
        });
    }

    private onGameStoreChange() {
        const gameState = gameStore.getGameState();

        const questionDifficultyLevelsToLoad = gameState.difficultyLevelsWithNoQuestionsLeft.filter(level => !Scene.questionLevelsLoading.has(level));

        if (questionDifficultyLevelsToLoad.length) {
            Scene.loadMoreQuestions(questionDifficultyLevelsToLoad);
        }

        this.setState(Object.assign({}, this.state, gameState));
    }
}

export default Scene;
