import React from 'react';
import './scene-style';
import QuestionPanel from '../questionPanel/questionPanel';
import {ISceneState} from "./scene.d";
import dispatcher from '../flux/dispatcher';
import {SetPlayerNameAction} from "./sceneActions";
import gameStore from "./gameStore";
import Typist from 'react-typist';
import classnames from 'classnames';

class Scene extends React.Component<{},ISceneState> {
    private boundGameStoreUpdateHandler;

    constructor() {
        super();

        this.state = {
            playerName: '',
            playerNameFormVisible: false
        };
        this.boundGameStoreUpdateHandler = this.onGameStoreChange.bind(this);
    }

    render() {
        return (
            <div className="scene">
                <div className="name-modal">
                    <div className="name-modal__inner">
                    <Typist className="name-modal__text" typing={1} avgTypingDelay={50} stdTypingDelay={0}
                            cursor={{show: false}} onTypingDone={() => this.setState({playerNameFormVisible: true})}>
                        Please type your name:
                    </Typist>
                    {this.renderNameForm()}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        gameStore.addListener(this.boundGameStoreUpdateHandler);
    }

    componentWillUnmount() {
        gameStore.removeListener(this.boundGameStoreUpdateHandler);
    }

    private renderNameForm() {
        const classes = classnames({
            'name-modal__form': true,
            'name-modal__form--hidden': !this.state.playerNameFormVisible
        });

        return (
            <div className={classes}>
                <input type="text" name="playerName" autoFocus
                       onChange={this.handleNameUpdate.bind(this)} />
                <button onClick={this.handleNameModalClose.bind(this)}>OK</button>
            </div>
        )

}

    private handleNameUpdate(event:Event) {
        const currentName = (event.target as HTMLInputElement).value;
        this.setState({
            playerName: currentName
        });
    }

    private handleNameModalClose() {
        this.setState({
            playerNameFormVisible: false
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
