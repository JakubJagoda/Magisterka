import * as React from 'react';
import * as classnames from "classnames";
import Typist from 'react-typist';
import CountTo from '../../third-party/react-count-to';

import './questionPanel.style';
import Animated from "../animated/animated";
import {EAnswerType} from "../puzzles/puzzles";

interface IQuestionPanelProps {
    word: string;
    definition: string;
    currentBet: number;
    playerMoney: number;
    currentQuestionNo: number;
    onTruthSelected?: () => void;
    onBunkSelected?: () => void;
    isAnswerToCurrentQuestionCorrect?: boolean;
    answerType?: EAnswerType;
    onResultShown?: () => void;
    onQuestionShown?: () => void;
    onQuestionTimeout?: () => void;
}

interface IQuestionPanelState {
    showButtons: boolean;
    timeTicking: boolean;
    timeLeft: number;
}

// @TODO OH GOD PLEASE REFACTOR THIS ONE
export default class QuestionPanel extends React.Component<IQuestionPanelProps, IQuestionPanelState> {
    private static TIME_FOR_QUESTION = 20;
    private playerMoney: number;
    private interval: number;

    constructor(props) {
        super(props);

        // this is because we want to render only initial amount of money. When this gets updated, the component
        // will be unmounted and mounted again anyway
        this.playerMoney = this.props.playerMoney;
        this.state = {
            showButtons: false,
            timeTicking: false,
            timeLeft: 0
        };
    }

    render() {
        if (this.props.hasOwnProperty('answerType')) {
            return this.renderAnswerResult();
        } else {
            return this.renderQuestion();
        }
    }

    private renderAnswerResult() {
        const timer = (
            <div className="question-panel-timer">
                <span className="question-panel-timer__info">Time left: </span>
                <span className="question-panel-timer__time">{this.state.timeLeft} sec</span>
                <div className="question-panel-timer__bar" style={{width: `${this.state.timeLeft / QuestionPanel.TIME_FOR_QUESTION * 100}%`}}></div>
            </div>
        );

        return (
            <div className="question-panel">
                {QuestionPanel.wrapContentsInAnimatedFadeOut(this.renderQuestionContents())}
                <div className="question-panel-buttons">
                    {this.renderAnimatedButtons()}
                </div>
                {QuestionPanel.wrapContentsInAnimatedFadeOut(timer)}
                {QuestionPanel.wrapContentsInAnimatedFadeOut(this.renderStatus())}
            </div>
        )
    }

    private renderQuestion() {
        let buttons: JSX.Element;
        let timer: JSX.Element;

        if (this.state.showButtons) {
            buttons = (
                <Animated animations={{
                    delay: 50,
                    length: 400,
                    style: {
                        opacity: 1
                    }
                }} initialStyle={{
                    opacity: 0,
                }}>
                    <div className="question-panel-buttons">
                        <span className="question-panel-buttons__text">Is this a...</span>
                        <button className="button button--ok question-panel-buttons__button"
                                onClick={() => {this.cancelTimeout(); this.props.onTruthSelected()}}>TRUTH</button>
                        <span>OR</span>
                        <button className="button button--warn question-panel-buttons__button"
                                onClick={() => {this.cancelTimeout(); this.props.onBunkSelected()}}>BUNK</button>
                    </div>
                </Animated>
            );

            timer = (
                <Animated animations={{
                    delay: 50,
                    length: 400,
                    style: {
                        opacity: 1
                    }
                }} initialStyle={{
                    opacity: 0,
                }}>
                    <div className="question-panel-timer">
                        <span className="question-panel-timer__info">Time left: </span>
                        <span className="question-panel-timer__time">{this.state.timeLeft} sec</span>
                        <div className="question-panel-timer__bar" style={{width: `${this.state.timeLeft / QuestionPanel.TIME_FOR_QUESTION * 100}%`}}></div>
                    </div>
                </Animated>
            );
        } else {
            buttons = null;
            timer = null;
        }

        return (
            <div className="question-panel">
                <Animated animations={{
                    length: 400,
                    style: {
                        top: 0
                    }
                }} initialStyle={{
                    position: 'absolute',
                    top: '-100%'
                }} finalStyle={{
                    position: 'static'
                }}>
                    {this.renderQuestionDetails()}
                </Animated>
                {buttons}
                {timer}
                <Animated animations={{
                    length: 400,
                    style: {
                        bottom: 0
                    }
                }} initialStyle={{
                    position: 'absolute',
                    bottom: '-100%'
                }} finalStyle={{
                    position: 'static'
                }}>
                    {this.renderStatus()}
                </Animated>
            </div>
        );
    }

    private renderQuestionDetails(): JSX.Element {
        return (
            <Typist avgTypingDelay={20} cursor={{show: false}} onTypingDone={this.onQuestionShown.bind(this)}>
                {this.renderQuestionContents()}
            </Typist>
        );
    }

    private renderQuestionContents(): JSX.Element {
        return (
            <div className="question-panel-question" >
                <span className="question-panel-question__question-no">Question #{String(this.props.currentQuestionNo)}</span>
                <span className="question-panel-question__word">{this.props.word}</span>
                <span className="question-panel-question__hyphen">is</span>
                <span className="question-panel-question__definition">{this.props.definition}</span>
            </div>
        )
    }

    private renderStatus(): JSX.Element {
        return (
            <div className="question-panel-status">
                <span>Current bet: <span className="question-panel-status__value">${this.props.currentBet}</span></span>
                <span>Money left: <span className="question-panel-status__value">${this.playerMoney}</span></span>
            </div>
        );
    }

    private renderAnimatedButtons() {
        const isThisA = QuestionPanel.wrapContentsInAnimatedFadeOut(<span className="question-panel-buttons__text">Is this a...</span>);
        const or = QuestionPanel.wrapContentsInAnimatedFadeOut(<span>OR</span>);

        let buttonTruth = <button className="button button--ok question-panel-buttons__button">TRUTH</button>;
        let buttonBunk = <button className="button button--warn question-panel-buttons__button">BUNK</button>;

        const textFileName = this.props.isAnswerToCurrentQuestionCorrect ? 'correct' : 'wrong';
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

        if (this.props.answerType === EAnswerType.TIMEOUT) {
            buttonBunk = QuestionPanel.wrapContentsInAnimatedFadeOut(buttonBunk);
            buttonTruth = QuestionPanel.wrapContentsInAnimatedFadeOut(buttonTruth);
        } else if (this.props.answerType === EAnswerType.TRUTH) {
            buttonBunk = QuestionPanel.wrapContentsInAnimatedFadeOut(buttonBunk);
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
            buttonTruth = QuestionPanel.wrapContentsInAnimatedFadeOut(buttonTruth);
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

        const moneyClassNames = classnames('question-panel-buttons__animated-status-money', {
            'question-panel-buttons__animated-status-money--plus': this.props.isAnswerToCurrentQuestionCorrect,
            'question-panel-buttons__animated-status-money--minus': !this.props.isAnswerToCurrentQuestionCorrect
        });

        const animatedCounter = (
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
                    <span className="question-panel-buttons__animated-status">
                    Current cash: $<CountTo from={this.playerMoney} to={this.props.playerMoney} speed={500}
                                                      className={moneyClassNames} initialDelay={2500} delay={50}
                                                      onComplete={() => setTimeout(this.props.onResultShown, 1000)} />
                </span>
            </Animated>
        );

        return (
            <div className="question-panel-buttons">
                {textImage}
                {isThisA}
                {buttonTruth}
                {or}
                {buttonBunk}
                {animatedCounter}
            </div>
        )
    }

    private onQuestionShown() {
        if (this.props.hasOwnProperty('answerType')) {
            return;
        }

        this.setState({showButtons: true, timeTicking: true, timeLeft: QuestionPanel.TIME_FOR_QUESTION});
        this.interval = setInterval(this.handleTimeTick.bind(this), 1000);

        if (this.props.onQuestionShown) {
            this.props.onQuestionShown();
        }
    }

    private handleTimeTick() {
        if (this.state.timeLeft === 0) {
            clearInterval(this.interval);
            this.interval = 0;

            if (this.props.onQuestionTimeout) {
                this.props.onQuestionTimeout();
            }
        } else {
            this.setState({timeLeft: this.state.timeLeft - 1});
        }
    }

    private cancelTimeout() {
        clearInterval(this.interval);
    }

    private static wrapContentsInAnimatedFadeOut(contents: JSX.Element) {
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
            ]} key={Math.random()}>
                {contents}
            </Animated>
        );
    }
}
