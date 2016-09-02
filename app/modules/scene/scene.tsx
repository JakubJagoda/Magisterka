import * as React from 'react';
import * as ReactRedux from 'react-redux';
import QuestionPanel from '../questionPanel/questionPanel';

class Scene extends React.Component<{},{}> {
    render() {
        return (
            <div className="scene">
                <QuestionPanel definition="" word=""></QuestionPanel>
            </div>
        );
    }

    static mapStateToProps(state:IAppState) {
        return {
            word: state.currentQuestion.word,
            definition: state.currentQuestion.definition
        };
    }
}

const WrappedScene = ReactRedux.connect(Scene.mapStateToProps);
const ConnectedScene = WrappedScene(Scene);

export default ConnectedScene;
