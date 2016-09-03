import * as React from 'react';
import QuestionPanel from '../questionPanel/questionPanel';
import {ISceneState} from "./scene.d";

class Scene extends React.Component<{},ISceneState> {
    constructor() {
        super();

        this.state = {
            playerNameModalVisible: false
        }
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
    }

    private renderNameModal() {
        if (this.state.playerNameModalVisible) {
            return (
                <div className="modal">
                    <input type="text" name="playerName" placeholder="Type name..." />
                </div>
            )
        } else {
            return null;
        }
    }
}

export default Scene;
