import React from 'react';

import './questionPanel.style';

interface IQuestionPanelProps {
    word: string;
    definition: string;
    currentBet: number;
    playerMoney: number;
    onTruthSelected: () => void;
    onBunkSelected: () => void;
}

export default class QuestionPanel extends React.Component<IQuestionPanelProps, {}> {
    render() {
        return (
            <div className="question-panel">
                <div className="question-panel-question">
                    <span>{this.props.word}</span> -
                    <span>{this.props.definition}</span>
                </div>
                <div className="question-panel-buttons">
                    <span className="question-panel-buttons__text">Is this a...</span>
                    <button className="button question-panel-buttons__button question-panel-buttons__button--truth"
                        onClick={this.props.onTruthSelected}>TRUTH</button>
                    <span>OR</span>
                    <button className="button question-panel-buttons__button question-panel-buttons__button--bunk"
                            onClick={this.props.onBunkSelected}>BUNK</button>
                </div>
                <div className="question-panel-status">
                    <span>Current bet: <span className="question-panel-status__value">${this.props.currentBet}</span></span>
                    <span>Money left: <span className="question-panel-status__value">${this.props.playerMoney}</span></span>
                </div>
            </div>
        );
    }
}
