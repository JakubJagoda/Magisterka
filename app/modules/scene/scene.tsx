import React from 'react';
import './scene-style';

import dispatcher from '../flux/dispatcher';
import {SetPlayerNameAction, BeginRoundAction} from './sceneActions';
import {default as gameStore, SCENE_STATES, IGameState} from './gameStore';

import PlayerNameForm from '../playerNameForm/playerNameForm';
import RoundIntro from "../roundIntro/roundIntro";

interface ISceneState extends IGameState {}

class Scene extends React.Component<{},ISceneState> {
    private boundGameStoreUpdateHandler;

    constructor() {
        super();

        this.state = {
            playerName: '',
            currentGameState: SCENE_STATES.NAME_INPUT,
            currentRound: 0
        };
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
                    <RoundIntro currentRound={this.state.currentRound} />
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

    private onGameStoreChange() {
        const gameState = gameStore.getGameState();

        this.setState(Object.assign({}, this.state, gameState));
    }
}

export default Scene;
