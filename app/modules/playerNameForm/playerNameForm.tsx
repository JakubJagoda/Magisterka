import React from 'react';
import classnames from "classnames";

import './playerNameForm.style';

import Animated from "../animated/animated";
import TypistModal from "../typistModal/typistModal";

interface IPlayerNameFormState {
    playerName: string;
    formDirty: boolean;
}

interface IPlayerNameFormProps {
    playerName?: string;
    onNameEntered?: (name: string) => void;
    onGreetingsGone?: () => void;
}

export default class PlayerNameForm extends React.Component<IPlayerNameFormProps,IPlayerNameFormState> {
    private input: HTMLInputElement;

    constructor() {
        super();

        this.state = {
            playerName: '',
            formDirty: false
        };
    }

    render() {
        if (this.props.playerName) {
            return this.renderGreetings();
        } else {
            return this.renderForm();
        }
    }

    private renderGreetings() {
        return (
            <Animated animations={[
                {
                    delay: 3500,
                    length: 200,
                    style: {
                        opacity: 0
                    },
                    callback: this.props.onGreetingsGone
                }
            ]}>
                <TypistModal text={`Okay, ${this.props.playerName}, are you ready...?`} typistProps={{avgTypingDelay: 75}} />
            </Animated>
        );
    }

    private renderForm() {
        const inputClassNames = classnames('name-form__input', {
            'name-form__input--error': !this.state.playerName && this.state.formDirty
        });

        return (
            <TypistModal text={'Please type your name:'} typistProps={{avgTypingDelay: 50}}>
                <form className="name-form" onSubmit={this.handleNameFormSubmit.bind(this)}>
                    <input type="text" name="playerName" autoFocus className={inputClassNames}
                           onChange={this.handleNameUpdate.bind(this)} ref={input => this.input = input}/>
                    <button className="button name-form__button"
                            type="submit">OK
                    </button>
                </form>
            </TypistModal>
        )
    }

    private handleNameUpdate(event: Event) {
        const currentName = (event.target as HTMLInputElement).value;
        this.setState(Object.assign(this.state, {
            playerName: currentName,
            formDirty: true
        }));
    }

    private handleNameFormSubmit(event: Event) {
        event.preventDefault();

        this.setState(Object.assign(this.state, {
            formDirty: true
        }), () => {
            if (this.state.playerName === '') {
                this.input.focus();
            } else {
                this.props.onNameEntered(this.state.playerName);
            }
        });
    }
}
