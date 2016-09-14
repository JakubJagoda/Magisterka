import React from 'react';
import './scene-style';
import dispatcher from '../flux/dispatcher';
import {SetPlayerNameAction} from "./sceneActions";
import gameStore from "./gameStore";
import PlayerNameForm from '../playerNameForm/playerNameForm';
import classnames from "classnames";

const enum SCENE_STATES {
    NAME_INPUT,
    ROUND_INTRO,
    PLACING_BET,
    QUESTION,
    QUESTION_AFTERMATHS,
    PLAYER_LOSE,
    PLAYER_WIN
}

interface ISceneState {
    currentState: SCENE_STATES
}

class Scene extends React.Component<{},ISceneState> {
    private boundGameStoreUpdateHandler;

    constructor() {
        super();

        this.state = {
            currentState: SCENE_STATES.NAME_INPUT
        };
        this.boundGameStoreUpdateHandler = this.onGameStoreChange.bind(this);
    }

    render() {
        return (
            <div className="scene">
                {this.renderSceneComponent()}
            </div>
        );
    }

    private renderSceneComponent() {
        switch(this.state.currentState) {
            case SCENE_STATES.NAME_INPUT:
            default:
                return (
                    <PlayerNameForm onNameEntered={this.handleNameEntered.bind(this)} />
                );
        }
    }

    componentDidMount() {
        gameStore.addListener(this.boundGameStoreUpdateHandler);
    }

    componentWillUnmount() {
        gameStore.removeListener(this.boundGameStoreUpdateHandler);
    }

    private handleNameEntered(playerName: string) {
        alert(playerName);
        // dispatcher.handleViewAction({
        //     action: new SetPlayerNameAction(playerName)
        // });
    }

    private onGameStoreChange() {
        const gameState = gameStore.getGameState();

        this.setState(Object.assign({}, this.state, gameState));
    }
}

export default Scene;
