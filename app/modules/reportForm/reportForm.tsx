import * as React from "react";

import {Question, Answer} from "../puzzles/puzzles";
import {EAnswerType} from "../puzzles/answers";

import './reportForm.style';
import Button from "../shared/button/button";

interface IReportFormProps {
    previousQuestion: Question;
    previousAnswer: Answer;
    onReportClicked: (answerID: string) => void;
    onCancelClicked: () => void;
}

interface IReportFormState {
    reported: boolean;
}

export default class ReportForm extends React.Component<IReportFormProps, IReportFormState> {
    constructor(props) {
        super(props);

        this.state = {
            reported: false
        };
    }

    render() {
        if (this.state.reported) {
            return this.renderReported();
        } else {
            return this.renderForm();
        }
    }

    renderReported() {
        return (
            <div className="report-form">
                <div className="report-form__header">Thank you for your report!</div>
                <div className="report-form__subheader">
                    We will look into it and try to investigate any abnormalities. Sorry for the inconvenience!
                </div>
                <div className="report-form__buttons">
                    <Button className="button" onClick={this.props.onCancelClicked}>OK</Button>
                </div>
            </div>
        )
    }

    renderForm() {
        const correctAnswer = this.props.previousAnswer.getCorrectAnswer() === EAnswerType.TRUTH ? 'truth' : 'bunk';
        const selectedAnswer = this.props.previousAnswer.getSelectedAnswer() === EAnswerType.TRUTH ? 'truth' : 'bunk';

        return (
            <div className="report-form">
                <div className="report-form__header">Do you want to report the question?</div>
                <div className="report-form__subheader">
                    If you believe something was not right with the question or the answer you provided, please let us
                    know by reporting it.
                    After reporting, you will be given back your bet and the question will be replayed.
                    In order to prevent abusing, you are only allowed to do this once per round,
                    so please be sure that the question you are reporting is really incorrect in some way.
                </div>
                <div className="report-form-question">
                    <span className="report-form-question__question">Question:</span>
                    <span className="report-form-question__word">{this.props.previousQuestion.getWord()}</span>
                    <span className="report-form-question__hyphen">is</span>
                    <span className="report-form-question__definition">
                        {this.props.previousQuestion.getDefinition()}
                    </span>
                </div>
                <div className="report-form__answers">
                    <div>
                        <span>Correct answer: </span>
                        <span
                            className={`report-form__answer report-form__answer--${correctAnswer}`}>{correctAnswer}</span>
                    </div>
                    <div>
                        <span>Your answer: </span>
                        <span
                            className={`report-form__answer report-form__answer--${selectedAnswer}`}>{selectedAnswer}</span>
                    </div>
                </div>
                <div className="report-form__buttons">
                    <Button className="button button--warn" onClick={this.handleReportButtonClicked.bind(this)}>Report
                    </Button>
                    <Button className="button" onClick={this.props.onCancelClicked}>Cancel</Button>
                </div>
            </div>
        );
    }

    private handleReportButtonClicked() {
        this.props.onReportClicked(this.props.previousAnswer.getAnswerID());
        this.setState(Object.assign({}, this.state, {
            reported: true
        }));
    }
}