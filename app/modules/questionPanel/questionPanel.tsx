import React from 'react';
import CountTo from '../../third-party/react-count-to';

import './questionPanel.style';
import Animated from "../animated/animated";
import classnames from "classnames";

interface IQuestionPanelProps {
    word: string;
    definition: string;
    currentBet: number;
    playerMoney: number;
    onTruthSelected?: () => void;
    onBunkSelected?: () => void;
    answerToCurrentQuestion?: boolean;
    isAnswerToCurrentQuestionCorrect?: boolean;
    onResultShown?: () => void;
}

export default class QuestionPanel extends React.Component<IQuestionPanelProps, {}> {
    private playerMoney: number;

    constructor(props) {
        super(props);

        // this is because we want to render only initial amount of money. When this gets updated, the component
        // will be unmounted and mounted again anyway
        this.playerMoney = this.props.playerMoney;
    }

    render() {
        if (this.props.hasOwnProperty('answerToCurrentQuestion')) {
            return this.renderAnswerResult();
        } else {
            return this.renderQuestion();
        }
    }

    private renderAnswerResult() {
        const moneyClassNames = classnames('question-panel__animated-status-money', {
            'question-panel__animated-status-money--plus': this.props.isAnswerToCurrentQuestionCorrect,
            'question-panel__animated-status-money--minus': !this.props.isAnswerToCurrentQuestionCorrect
        });

        return (
            <div className="question-panel">
                {QuestionPanel.wrapContentsInAnimated(QuestionPanel.renderWordAndDefinition(this.props.word, this.props.definition))}
                <div className="question-panel-buttons">
                    {QuestionPanel.renderAnimatedButtons(this.props.answerToCurrentQuestion, this.props.isAnswerToCurrentQuestionCorrect)}
                </div>
                <Animated animations={[
                    {
                        delay: 2000,
                        length: 200,
                        style: {
                            opacity: 1
                        }
                    }
                ]} initialStyle={{
                    opacity: 0
                }}>
                    <span className="question-panel__animated-status">
                    Current account status: $<CountTo from={this.playerMoney} to={this.props.playerMoney} speed={500}
                                                      className={moneyClassNames} initialDelay={2500} delay={50}
                                                      onComplete={() => setTimeout(this.props.onResultShown, 1000)} />
                </span>
                </Animated>
                {QuestionPanel.wrapContentsInAnimated(QuestionPanel.renderStatus(this.props.currentBet, this.playerMoney))}
            </div>
        )
    }

    private renderQuestion() {
        return (
            <div className="question-panel">
                {QuestionPanel.renderWordAndDefinition(this.props.word, this.props.definition)}
                <div className="question-panel-buttons">
                    <span className="question-panel-buttons__text">Is this a...</span>
                    <button className="button question-panel-buttons__button question-panel-buttons__button--truth"
                            onClick={this.props.onTruthSelected}>TRUTH</button>
                    <span>OR</span>
                    <button className="button question-panel-buttons__button question-panel-buttons__button--bunk"
                            onClick={this.props.onBunkSelected}>BUNK</button>
                </div>
                {QuestionPanel.renderStatus(this.props.currentBet, this.playerMoney)}
            </div>
        );
    }

    private static renderWordAndDefinition(word: string, definition: string): JSX.Element {
        return (
            <div className="question-panel-question">
                <span>{word}</span> -
                <span>{definition}</span>
            </div>
        );
    }

    private static renderStatus(currentBet: number, playerMoney: number): JSX.Element {
        return (
            <div className="question-panel-status">
                <span>Current bet: <span className="question-panel-status__value">${currentBet}</span></span>
                <span>Money left: <span className="question-panel-status__value">${playerMoney}</span></span>
            </div>
        );
    }

    private static renderAnimatedButtons(answer: boolean, isAnswerCorrect: boolean) {
        const isThisA = QuestionPanel.wrapContentsInAnimated(<span className="question-panel-buttons__text">Is this a...</span>);
        const or = QuestionPanel.wrapContentsInAnimated(<span>OR</span>);

        let buttonTruth = <button className="button question-panel-buttons__button question-panel-buttons__button--truth">TRUTH</button>;
        let buttonBunk = <button className="button question-panel-buttons__button question-panel-buttons__button--bunk">BUNK</button>;

        const textFileName = isAnswerCorrect ? 'correct' : 'wrong';
        const textImage = (
            <Animated animations={[
                {
                    delay: 1500,
                    length: 100,
                    style: {
                        top: '-80px'
                    },
                    easing: 'ease-out'
                }
            ]} initialStyle={{
                top: '-100vh'
            }}>
                <img className="question-panel-buttons__result-text" src={`static/img/${textFileName}.png`} />
            </Animated>
        );

        if (answer) {
            buttonBunk = QuestionPanel.wrapContentsInAnimated(buttonBunk);
            buttonTruth = (
                <Animated animations={[
                    {
                        length: 500,
                        style: {
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }
                    }
                ]} initialStyle={{
                    position: 'relative',
                    left: 0
                }}>
                    {buttonTruth}
                </Animated>
            );
        } else {
            buttonTruth = QuestionPanel.wrapContentsInAnimated(buttonTruth);
            buttonBunk = (
                <Animated animations={[
                    {
                        length: 500,
                        style: {
                            right: '50%',
                            transform: 'translateX(50%)'
                        }
                    }
                ]} initialStyle={{
                    position: 'relative',
                    right: 0
                }}>
                    {buttonBunk}
                </Animated>
            );
        }

        return (
            <div className="question-panel-buttons">
                {textImage}
                {isThisA}
                {buttonTruth}
                {or}
                {buttonBunk}
            </div>
        )
    }

    private static wrapContentsInAnimated(contents: JSX.Element) {
        return (
            <Animated animations={[
                {
                    length: 300,
                    style: {
                        transform: 'scale(0.5)',
                        opacity: 0
                    },
                    easing: 'linear',
                }
            ]}>
                {contents}
            </Animated>
        );
    }
}
