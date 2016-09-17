import React from 'react';
import classnames from "classnames";
import TypistModal from "../typistModal/typistModal";

import './placeBetForm.style';

interface IPlaceBetFormProps {
    onBetEntered: (bet: number) => void;
    maxBet?: number;
    currentPlayerMoney?: number;
    minBet: number;
}

interface IPlaceBetFormState {
    bet: number;
    formDirty: boolean;
}

export default class PlaceBetForm extends React.Component<IPlaceBetFormProps,IPlaceBetFormState> {
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
            <TypistModal text={`Almost out of cash!
            You have to go va banque!`} typistProps={{avgTypingDelay: 40}}>
                <span className="place-bet-form__current-cash-status">Current cash: ${this.props.currentPlayerMoney}</span>
                <button className="button place-bet-form__button" onClick={this.handleVaBanqueButtonClick.bind(this)}>OK</button>
            </TypistModal>
        );
    }

    private renderForm() {
        return (
            <TypistModal text={'Please place your bet:'} typistProps={{avgTypingDelay: 50}}>
                <form className="place-bet-form" onSubmit={this.handlePlaceBetFormSubmit.bind(this)}>
                    <input type="number" autoFocus className="place-bet-form__input" min={PlaceBetForm.MINIMAL_BET}
                           max={this.props.maxBet} step="10" defaultValue={String(this.state.bet)}
                           onChange={this.handleBetUpdate.bind(this)} ref={input => this.input = input} />
                    <span className="place-bet-form__current-cash-status">Current cash: ${this.props.currentPlayerMoney}</span>
                    <button className="button place-bet-form__button" type="submit">OK</button>
                </form>
            </TypistModal>
        );
    }

    private handleBetUpdate() {
        this.setState({
            bet: Number(this.input.value),
            formDirty: true
        });
    }

    private handlePlaceBetFormSubmit(event: Event) {
        event.preventDefault();

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
}