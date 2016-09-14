import React from 'react';
import classnames from "classnames";
import Typist from 'react-typist';
import './playerNameForm-style.scss';

interface IPlayerNameFormState {
    playerName: string;
    playerNameFormVisible: boolean;
    formDirty: boolean;
}

interface IPlayerNameFormProps {
    className?: string;
    onNameEntered: (name: string) => void;
}

export default class PlayerNameForm extends React.Component<IPlayerNameFormProps,IPlayerNameFormState> {
    private input: HTMLInputElement;

    constructor() {
        super();

        this.state = {
            playerName: '',
            playerNameFormVisible: false,
            formDirty: false
        };
    }

    render() {
        const inputClassNames = classnames('name-form__input', {
            'name-form__input--error': !this.state.playerName && this.state.formDirty
        });
        const containerClassNames = classnames(this.props.className, 'name-form-container');
        const formClassNames = classnames('name-form', {
            'name-form--hidden': !this.state.playerNameFormVisible
        });

        return (
        <div className={containerClassNames}>
            <Typist className="name-form-container__text" typing={1} avgTypingDelay={50} stdTypingDelay={0}
                    cursor={{show: false}} onTypingDone={() => this.setState(Object.assign(this.state, {playerNameFormVisible: true}))}>
                Please type your name:
            </Typist>
            <form className={formClassNames} onSubmit={this.handleNameFormSubmit.bind(this)}>
                <input type="text" name="playerName" autoFocus className={inputClassNames} disabled={!this.state.playerNameFormVisible}
                       onChange={this.handleNameUpdate.bind(this)} ref={input => this.input = input} />
                <button disabled={!this.state.playerNameFormVisible} className="button name-form__button" type="submit">OK</button>
            </form>
        </div>
        )
    }

    private handleNameUpdate(event:Event) {
        const currentName = (event.target as HTMLInputElement).value;
        this.setState(Object.assign(this.state,{
            playerName: currentName,
            formDirty: true
        }));
    }

    private handleNameFormSubmit() {
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
