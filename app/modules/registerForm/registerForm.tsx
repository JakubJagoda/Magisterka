import * as React from 'react';
import {hashHistory, Link} from 'react-router';

import * as Api from '../api/api';
import './registerForm.style';

interface IRegisterFormFormFields {
    login: string;
    password: string;
    confirmPassword: string;
    email: string;
}

interface IRegisterFormState extends IRegisterFormFormFields {
    error: string;
    loading: boolean;
}

type RegisterFormStateAllowedFields = keyof IRegisterFormFormFields;

export default class RegisterForm extends React.Component<{},IRegisterFormState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            confirmPassword: "",
            email: "",
            error: "",
            loading: false
        };
    }

    render() {
        return (
            <form className="register-form" onSubmit={this.submitForm.bind(this)}>
                <span className="register-form__info--bold">
                    Registering is optional.
                </span>
                <span className="register-form__info">
                    If you register, you'll be able to save your high scores and see the leaderboard.
                </span>
                <label className="register-form__item">
                    Login:
                    <input type="text" onChange={e => {this.updateLogin(e)}} />
                </label>
                <label className="register-form__item">
                    Password:
                    <input type="password" onChange={e => {this.updatePassword(e)}} />
                </label>
                <label className="register-form__item">
                    Confirm password:
                    <input type="password" onChange={e => {this.updatePasswordConfirm(e)}} />
                </label>
                <label className="register-form__item">
                    E-mail:
                    <input type="text" onChange={e => {this.updateEmail(e)}} />
                </label>
                {this.state.error ? <div className="register-form__error">{this.state.error}</div> : ''}
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
                        <div className="register-form__buttons">
                            <Link to={{pathname: '/', query: { skipAnimation: true }}}>
                                <button className="button button--warn register-form__button" type="button">
                                    Cancel
                                </button>
                            </Link>
                            <button className="button button--ok register-form__button" type="submit">
                                Register
                            </button>
                        </div>
                }
            </form>
        )
    }

    private updateLogin(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "login");
    }

    private updatePassword(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "password");
    }

    private updatePasswordConfirm(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "confirmPassword");
    }

    private updateEmail(e: React.FormEvent<HTMLInputElement>) {
        this.updateFieldInStateFromEvent(e, "email");
    }

    private updateFieldInStateFromEvent(e: React.FormEvent<HTMLInputElement>, fieldName: RegisterFormStateAllowedFields) {
        const {value} = (e.target as HTMLInputElement);
        const newState = Object.assign(this.state, {[fieldName]: value});
        this.setState(newState);
    }

    private async submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.setState(Object.assign({}, this.state, {loading: true, error: ''}));
        const formData = Object.assign({}, this.state);
        try {
            await Api.registerUser(formData);
            hashHistory.push('/signin');
        } catch (e) {
            this.setState(Object.assign({}, this.state, {error: e.message, loading: false}));
        }
    }
}