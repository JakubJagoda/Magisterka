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
    QuestionTimeoutAction, QuestionsLoadedAction, ShowReportQuestionFormAction, ReportQuestionAction,
    FinishedReportingQuestionAction, FinishGameAction
} from './sceneActions';
import {default as gameStore, SCENE_STATES, IGameState} from './gameStore';
import * as Puzzles from '../puzzles/puzzles'

import PlayerNameForm from '../playerNameForm/playerNameForm';
import RoundIntro from "../roundIntro/roundIntro";
import PlaceBetForm from "../placeBetForm/placeBetForm";
import QuestionPanel from "../questionPanel/questionPanel";
import GameOver from "../gameOver/gameOver";
import {hashHistory} from "react-router";
import ReportForm from "../reportForm/reportForm";
import Sounds from "../sounds/sounds";

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
                                  onBetEntered={Scene.handleBetEntered}
                                  allowReport={this.state.canReportPreviousQuestion}
                                  onReportQuestionClicked={Scene.handleShowReportQuestionForm}
                                  questionNumber={this.state.currentQuestionNumberInRound}
                                  roundNumber={this.state.currentRound}
                                  maxQuestionsInRound={this.state.numberOfQuestionsInRound}
                                  maxRounds={this.state.numberOfRounds} allowFinish={this.state.canFinishGame}
                                  onFinishGameClicked={Scene.handleFinishGame}/>
                );

            case SCENE_STATES.QUESTION:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()}
                                   definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   onTruthSelected={Scene.handleQuestionAnswered.bind(null, Puzzles.EAnswerType.TRUTH)}
                                   onBunkSelected={Scene.handleQuestionAnswered.bind(null, Puzzles.EAnswerType.BUNK)}
                                   onQuestionTimeout={Scene.handleQuestionTimeout.bind(null)}
                                   onQuestionShown={Scene.handleQuestionShown.bind(null)}/>
                );

            case SCENE_STATES.ANSWER_RESULTS:
                return (
                    <QuestionPanel word={this.state.currentQuestion.getWord()}
                                   definition={this.state.currentQuestion.getDefinition()}
                                   currentBet={this.state.currentBet} playerMoney={this.state.playerMoney}
                                   currentQuestionNo={this.state.currentQuestionNumberInRound + 1}
                                   isAnswerToCurrentQuestionCorrect={this.state.isAnswerToCurrentQuestionCorrect}
                                   answerType={this.state.answerType}
                                   onResultShown={Scene.handleQuestionResultShown}/>
                );

            case SCENE_STATES.PLAYER_LOSE:
                return (
                    <GameOver didPlayerWin={false} playerMoney={this.state.playerMoney}
                              gameID={this.state.gameID}
                              onScoreShown={Scene.handleFinalScoreShown}/>
                );

            case SCENE_STATES.PLAYER_WIN:
                return (
                    <GameOver didPlayerWin={true} playerMoney={this.state.playerMoney}
                              gameID={this.state.gameID}
                              onScoreShown={Scene.handleFinalScoreShown}/>
                );

            case SCENE_STATES.WAITING_FOR_QUESTIONS:
                return (
                    <div>Loading questions... If it takes too long, there might be a server issue</div>
                );

            case SCENE_STATES.REPORT_QUESTION:
                return (
                    <ReportForm previousAnswer={this.state.previousAnswer}
                                previousQuestion={this.state.previousQuestion}
                                onReportClicked={Scene.handleReportQuestion}
                                onCancelClicked={Scene.handleCancelReportingQuestion}/>
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
        Sounds.stopMainMusic();
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

    private static handleQuestionAnswered(answer: Puzzles.EAnswerType) {
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

    private static handleShowReportQuestionForm() {
        dispatcher.handleViewAction({
            action: new ShowReportQuestionFormAction()
        });
    }

    private static handleReportQuestion(answerID: string) {
        dispatcher.handleViewAction({
            action: new ReportQuestionAction(answerID)
        });
    }

    private static handleCancelReportingQuestion() {
        dispatcher.handleViewAction({
            action: new FinishedReportingQuestionAction()
        });
    }

    private static handleFinishGame() {
        dispatcher.handleViewAction({
            action: new FinishGameAction()
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
