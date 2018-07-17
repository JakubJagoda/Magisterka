import * as React from 'react';
import TypistModal from "../typistModal/typistModal";

import './placeBetForm.style';
import Button, {EButtonType} from "../shared/button/button";

interface IPlaceBetFormProps {
    onBetEntered: (bet: number) => void;
    maxBet?: number;
    currentPlayerMoney?: number;
    minBet: number;
    allowReport?: boolean;
    onReportQuestionClicked: () => void;
    roundNumber: number;
    questionNumber: number;
    maxQuestionsInRound: number;
    maxRounds: number;
    allowFinish?: boolean;
    onFinishGameClicked?: () => void;
}

interface IPlaceBetFormState {
    bet: number;
    formDirty: boolean;
}

export default class PlaceBetForm extends React.Component<IPlaceBetFormProps, IPlaceBetFormState> {
    private input: HTMLInputElement;
    private static MINIMAL_BET = 10;

    constructor(props) {
        super(props);

        this.state = {
            bet: this.props.minBet,
            formDirty: false
        };
    }

    render() {
        if (this.props.minBet >= this.props.currentPlayerMoney) {
            return this.renderBudgetLessThanMinBetWarning();
        } else {
            return this.renderForm();
        }
    }

    private renderBudgetLessThanMinBetWarning() {
        return (
            <TypistModal text={`Almost out of cash! You have to go va banque!`}
                         typistProps={{avgTypingDelay: 40}}
                         className="place-bet-form">
                <span className="place-bet-form__current-cash-status">Current cash: ${this.props.currentPlayerMoney}</span>
                <Button className="place-bet-form__button"
                        onClick={this.handleVaBanqueButtonClick.bind(this)}>OK</Button>
                {this.renderFormExtras()}
            </TypistModal>
        );
    }

    private renderForm() {
        return (
            <TypistModal text={'Please place your bet:'}
                         typistProps={{avgTypingDelay: 20}}>
                <form className="place-bet-form"
                      onSubmit={this.handlePlaceBetFormSubmit.bind(this)}>
                    <input type="number"
                           autoFocus
                           className="place-bet-form__input"
                           min={PlaceBetForm.MINIMAL_BET}
                           max={this.props.maxBet}
                           step="10"
                           defaultValue={String(this.state.bet)}
                           onChange={this.handleBetUpdate.bind(this)}
                           ref={input => this.input = input}/>
                    <div className="place-bet-form__current-cash-status">
                        Current cash:
                        <span className="place-bet-form__current-cash-amount">${this.props.currentPlayerMoney}</span>
                    </div>
                    <Button className="place-bet-form__button"
                            onClick={this.handlePlaceBetFormSubmit.bind(this)}>OK</Button>
                    {this.renderFormExtras()}
                </form>
            </TypistModal>
        );
    }

    private renderFormExtras() {
        return <div className="place-bet-form__extras">
            <div className="place-bet-form-info">
                <div className="place-bet-form-progress">
                    <span className="place-bet-form-progress__text-item">Round:</span>
                    {this.renderBarCounter(this.props.roundNumber + 1, this.props.maxRounds)}
                </div>
                <div className="place-bet-form-progress">
                    <span className="place-bet-form-progress__text-item">Question:</span>
                    {this.renderBarCounter(this.props.questionNumber + 1, this.props.maxQuestionsInRound)}
                </div>
            </div>
            {this.props.allowReport && <Button buttonType={EButtonType.WARN}
                                               className="place-bet-form__button place-bet-form__button--report"
                                               onClick={this.handleReportClick.bind(this)}>Report previous question</Button>}
            {this.props.allowFinish && <Button buttonType={EButtonType.OK}
                                               className="place-bet-form__button place-bet-form__button--finish"
                                               onClick={this.handleFinishClick.bind(this)}>End game</Button>}
        </div>;
    }

    private renderBarCounter(currentVal: number, maxVal: number) {
        return <React.Fragment>
            {
                new Array(currentVal)
                    .fill(0)
                    .map((_, i) => <div key={i} className="place-bet-form-progress__item"></div>)
            }
            {
                new Array(maxVal - currentVal)
                    .fill(0)
                    .map((_, i) => <div key={i} className="place-bet-form-progress__item place-bet-form-progress__item--inactive"></div>)
            }
        </React.Fragment>
    }

    private handleBetUpdate() {
        this.setState({
            bet: Number(this.input.value),
            formDirty: true
        });
    }

    private handlePlaceBetFormSubmit(event: Event) {
        event.preventDefault();

        if (this.state.bet > this.props.maxBet) {
            return;
        }

        this.setState(Object.assign(this.state, {
            formDirty: true
        }), () => {
            this.props.onBetEntered(this.state.bet);
        });
    }

    private handleVaBanqueButtonClick() {
        this.setState(Object.assign(this.state, {
            formDirty: true,
            bet: this.props.currentPlayerMoney
        }), () => {
            this.props.onBetEntered(this.state.bet);
        });
    }

    private handleReportClick(): void {
        this.props.onReportQuestionClicked();
    }

    private handleFinishClick(): void {
        this.props.onFinishGameClicked && this.props.onFinishGameClicked();
    }
}