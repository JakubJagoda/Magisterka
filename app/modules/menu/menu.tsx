import * as React from "react";
import './menu.style';
import {Link, WithRouterProps} from 'react-router';
import Animated from '../animated/animated';
import userStore from '../user/userStore';
import Button from '../shared/button/button';
import Sounds, {ESoundSample} from '../sounds/sounds';
import Dispatcher from "../flux/dispatcher";
import {LogoutUserAction, UserLoggedInAction} from "../user/userActions";

interface IMenuState {
    loading: boolean;
}

interface IMenuProps extends WithRouterProps {
    loading?: boolean;
}

export default class Menu extends React.Component<IMenuProps, IMenuState> {
    private onUserStoreChangeBound = this.onUserStoreChange.bind(this);

    constructor(props) {
        super(props);

        this.state = {
            loading: !userStore.getUserData().deviceID
        };

        userStore.addListener(this.onUserStoreChangeBound);
    }

    componentWillUnmount() {
        userStore.removeListener(this.onUserStoreChangeBound);
        Sounds.stopMenuMusic();
    }

    private onUserStoreChange() {
        const {deviceID} = userStore.getUserData();

        this.setState(Object.assign(this.state, {
            loading: !deviceID
        }));
    }

    render() {
        return (
            <div className="menu">
                {this.renderEnteringAnimation()}
                {this.renderButtonsAnimation()}
            </div>
        );
    }

    private renderEnteringAnimation(): JSX.Element {
        return (
            <Animated animations={{
                delay: 2500,
                length: 200,
                style: {
                    width: 'auto',
                    height: 'auto',
                    transform: 'scale(0.75) translateY(-75%)'
                }
            }}
                      initialStyle={{width: '100vw', height: '100vh'}}
                      skipIf={Boolean(this.props.location.query.skipAnimation)}>
                <div className="menu__game-title">
                    <Animated animations={
                        {
                            delay: 0,
                            length: 200,
                            style: {
                                right: 0
                            },
                            callback: () => {
                                if (this.props.location.query.skipAnimation) {
                                    return;
                                }
                                Sounds.playSound(ESoundSample.LOGO_FADE_IN);
                            }
                        }}
                              initialStyle={{right: '-100%'}}
                              skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src='./static/img/logo-truth.png'/>
                    </Animated>
                    <Animated animations={{
                        delay: 800,
                        length: 200,
                        style: {
                            top: 0
                        },
                        callback: () => {
                            if (this.props.location.query.skipAnimation) {
                                return;
                            }
                            Sounds.playSound(ESoundSample.LOGO_FADE_IN);
                        }
                    }}
                              initialStyle={{top: '100%'}}
                              skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src='./static/img/logo-or.png'/>
                    </Animated>
                    <Animated animations={{
                        delay: 1600,
                        length: 200,
                        style: {
                            left: 0
                        },
                        callback: () => {
                            if (!this.props.location.query.skipAnimation) {
                                Sounds.playSound(ESoundSample.LOGO_FADE_IN);
                            }
                            Sounds.playMenuMusic();
                        }
                    }}
                              initialStyle={{left: '-100%'}}
                              skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src='./static/img/logo-bunk.png'/>
                    </Animated>
                </div>
            </Animated>
        );
    }

    private renderButtonsAnimation(): JSX.Element {
        let inner;

        const buttons = {
            newGame: (
                <Link to="/game">
                    <Button>New Game</Button>
                    {/*<button className="menu__item">New Game</button>*/}
                </Link>
            ),
            register: (
                <Link to="/register">
                    <Button>Register</Button>
                </Link>
            ),
            registerNew: (
                <Link to="/register">
                    <Button>Register new player</Button>
                </Link>
            ),
            signIn: (
                <Link to="/signin">
                    <Button>Sign in</Button>
                </Link>
            ),
            signOut: (
                <Button onClick={this.signOut.bind(this)}>Sign out</Button>
            )
        };

        if (this.state.loading) {
            inner = (
                <div className="menu__buttons">
                    <div className="sk-double-bounce">
                        <span className="sk-child sk-double-bounce1"></span>
                        <span className="sk-child sk-double-bounce2"></span>
                    </div>
                    <span>Waiting for Hubert Urbański...</span>
                </div>
            )
        } else {
            inner = (<div className="menu__buttons">
                {userStore.isUserLoggedIn() &&
                <div className="menu__signed-in">Signed in as <strong>{userStore.getUserData().userName}</strong></div>}
                {buttons.newGame}
                {userStore.isUserLoggedIn() && buttons.signOut}
                {!userStore.isUserLoggedIn() && buttons.register}
                {!userStore.isUserLoggedIn() && buttons.signIn}
            </div>);
        }

        return (<Animated animations={{
            delay: 3000,
            length: 500,
            style: {
                top: '50%'
            },
            easing: 'ease-out',
        }}
                          initialStyle={{top: '100%'}}
                          skipIf={Boolean(this.props.location.query.skipAnimation)}>
            {inner}
        </Animated>);
    }

    private signOut() {
        Dispatcher.handleViewAction({
            action: new LogoutUserAction()
        });
    }
}
