import * as React from 'react';
import QuestionPanel from '../questionPanel/questionPanel';
import {ISceneState} from "./scene.d";
import dispatcher from '../flux/dispatcher';
import {SetPlayerNameAction} from "./sceneActions";
import gameStore from "./gameStore";

class Scene extends React.Component<{},ISceneState> {
    private boundGameStoreUpdateHandler;

    constructor() {
        super();

        this.state = {
            playerName: '',
            playerNameModalVisible: false
        };
        this.boundGameStoreUpdateHandler = this.onGameStoreChange.bind(this);
    }

    render() {
        return (
            <div className="scene">
                {this.renderNameModal()}
                <QuestionPanel definition="" word=""></QuestionPanel>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            playerNameModalVisible: true
        });

        gameStore.addListener(this.boundGameStoreUpdateHandler);
    }

    componentWillUnmount() {
        gameStore.removeListener(this.boundGameStoreUpdateHandler);
    }

    private renderNameModal() {
        if (this.state.playerNameModalVisible) {
            return (
                <div className="modal">
                    <input type="text" name="playerName" placeholder="Type name..." onChange={this.handleNameUpdate.bind(this)} />
                    <button onClick={this.handleNameModalClose.bind(this)}>OK</button>
                </div>
            )
        } else {
            return (
                <span>{this.state.playerName}</span>
            );
        }
    }

    private handleNameUpdate(event:Event) {
        const currentName = (event.target as HTMLInputElement).value;
        this.setState({
            playerName: currentName
        });
    }

    private handleNameModalClose() {
        this.setState({
            playerNameModalVisible: false
        }, () => {
            dispatcher.handleViewAction({
                action: new SetPlayerNameAction(this.state.playerName)
            });
        });
    }

    private onGameStoreChange() {
        const gameState = gameStore.getGameState();

        this.setState(Object.assign({}, this.state, gameState));
    }
}

export default Scene;
