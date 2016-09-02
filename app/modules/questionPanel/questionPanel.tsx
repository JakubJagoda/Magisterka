import * as React from 'react';

interface IQuestionPanelProps {
    word: string;
    definition: string;
}

export default class QuestionPanel extends React.Component<IQuestionPanelProps, {}> {
    render() {
        return (
            <div className="question-panel">
                <span>{this.props.word}</span> -
                <span>{this.props.definition}</span>
            </div>
        );
    }
}
