import * as React from 'react';
import {Link} from 'react-router';

import * as Api from '../api/api';
import './signInForm.style';
import Dispatcher from '../flux/dispatcher';
import {UserLoggedInAction} from '../user/userActions';
import userStore from '../user/userStore';

interface ISignInFormFormFields {
    login: string;
    password: string;
}

interface IRegisterFormState extends ISignInFormFormFields {
    error: string;
    loading: boolean;
    loggedIn: boolean;
}

type SignInFormStateAllowedFields = keyof ISignInFormFormFields;

export default class SignInForm extends React.Component<{},IRegisterFormState> {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            error: '',
            loading: false,
            loggedIn: false
        }
    }

    render(): JSX.Element {
        if (this.state.loggedIn) {
            return this.renderGreeting();
        } else {
            return this.renderForm();
        }
    }

    private renderForm() {
        const userName = userStore.getUserData().userName;

        return (
            <form className="login-form" onSubmit={this.submitForm.bind(this)}>
                <div className="login-form__info">
                    <h2>Sign in</h2>
                    {
                        userName ?
                            <span>You are signed in as <strong>{userName}</strong>. Sign in again, to play as a different user</span>
                            :
                            <span>You can still play without signing in, but you won't have access to your scores</span>
                    }
                </div>
                <label className="login-form__item">
                    Login:
                    <input type="text" onChange={e => {
                        this.updateLogin(e)
                    }}/>
                </label>
                <label className="login-form__item">
                    Password:
                    <input type="password" onChange={e => {
                        this.updatePassword(e)
                    }}/>
                </label>
                {this.state.error ? <div className="login-form__error">{this.state.error}</div> : ''}
                {
                    this.state.loading ?
                        <div>
                            <div className="sk-double-bounce">
                                <span className="sk-child sk-double-bounce1"></span>
                                <span className="sk-child sk-double-bounce2"></span>
                            </div>
                            Loading...
                        </div>
                        :
                        <div className="login-form__buttons">
                            <Link to={{pathname: '/', query: {skipAnimation: true}}}>
                                <button className="button button--warn login-form__button" type="button">
                                    Cancel
                                </button>
                            </Link>
                            <button type="submit" className="button button--ok login-form__button">Sign in</button>
                        </div>
                }
            </form>
        );
    }

    private renderGreeting() {
        return (
            <div className="login-form login-form--greetings">
                <h1>Hello again, {userStore.getUserData().userName}!</h1>
                <h2>Are you ready for winning some money?</h2>
                <Link to="/?skipAnimation=true">
                    <button className="button button--ok">Sure I am!</button>
                </Link>
            </div>
        )
    }

    private updateLogin(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "login");
    }

    private updatePassword(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "password");
    }

    private updateFieldInStateFromEvent(e: React.FormEvent<HTMLInputElement>, fieldName: SignInFormStateAllowedFields) {
        const {value} = (e.target as HTMLInputElement);
        const newState = Object.assign(this.state, {[fieldName]: value});
        this.setState(newState);
    }

    private async submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.setState(Object.assign({}, this.state, {loading: true, error: ''}));
        const formData = Object.assign({}, this.state);
        try {
            const user = await Api.loginUser(formData);
            Dispatcher.handleServerAction({
                action: new UserLoggedInAction(user.id, user.login)
            });

            this.setState(Object.assign({}, this.state, {loggedIn: true}))
        } catch (e) {
            this.setState(Object.assign({}, this.state, {error: e.message}));
        } finally {
            this.setState(Object.assign({}, this.state, {loading: false}));
        }
    }
}