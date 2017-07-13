import * as React from "react";
import './menu.style';
import {Link} from 'react-router';
import Animated from '../animated/animated';
import userStore from '../user/userStore';

interface IMenuState {
    loading: boolean;
}

export default class Menu extends React.Component<{loading?: boolean},IMenuState> {
    private onUserStoreChangeBound = this.onUserStoreChange.bind(this);

    constructor(...props) {
        super(...props);

        this.state = {
            loading: true
        };

        userStore.addListener(this.onUserStoreChangeBound);
    }

    componentWillUnmount() {
        userStore.removeListener(this.onUserStoreChangeBound);
    }

    private onUserStoreChange() {
        const {deviceID} = userStore.getUserData();

        if (deviceID) {
            this.setState(Object.assign(this.state, {
                loading: false
            }));
        } else {
            this.setState(Object.assign(this.state, {
                loading: true
            }));
        }
    }

    render() {
        return (
            <div className="menu">
                {Menu.renderEnteringAnimation()}
                {this.renderButtonsAnimation()}
            </div>
        );
    }

    private static renderEnteringAnimation(): JSX.Element {
        return (
            <Animated animations={{
                    delay: 2500,
                    length: 200,
                    style: {
                        width: 'auto',
                        height: 'auto',
                        transform: 'scale(0.75) translateY(-75%)'
                    }
                }} initialStyle={{width: '100vw', height: '100vh'}}>
                <div className="menu__game-title">
                    <Animated animations={{
                              delay: 0,
                              length: 200,
                              style: {
                                  right: 0
                              }
                          }} initialStyle={{right: '-100%'}}>
                        <img src="static/img/logo-truth.png" />
                    </Animated>
                    <Animated animations={{
                              delay: 800,
                              length: 200,
                              style: {
                                  top: 0
                              }
                          }} initialStyle={{top: '100%'}}>
                        <img src="static/img/logo-or.png" />
                    </Animated>
                    <Animated animations={{
                              delay: 1600,
                              length: 200,
                              style: {
                                  left: 0
                              }
                          }} initialStyle={{left: '-100%'}}>
                        <img src="static/img/logo-bunk.png" />
                    </Animated>
                </div>
            </Animated>
        );
    }

    private renderButtonsAnimation(): JSX.Element {
        let element;

        if (this.state.loading) {
            element = (
                <Animated key={Math.random()} animations={{
                    delay: 3000,
                    length: 500,
                    style: {
                        top: '50%'
                    },
                    easing: 'ease-out',
                    name: 'loading'
                }} initialStyle={{top: '100%'}}>
                    <div className="menu__buttons">
                        <div className="sk-double-bounce">
                            <span className="sk-child sk-double-bounce1"></span>
                            <span className="sk-child sk-double-bounce2"></span>
                        </div>
                        <span>Waiting for Hubert Urbański...</span>
                    </div>
                </Animated>
            )
        } else {
            element = (<Animated key={Math.random()} animations={{
                    delay: 10,
                    length: 500,
                    style: {
                        top: '50%'
                    },
                    easing: 'ease-out',
                    after: 'loading'
                }} initialStyle={{top: '100%'}}>
                    <div className="menu__buttons">
                        <Link to="/game">
                            <button className="menu__item">New Game</button>
                        </Link>
                        <Link to="/highscores">
                            <button className="menu__item">High Scores</button>
                        </Link>
                        <Link to="/register">
                            <button className="menu__item">Register</button>
                        </Link>
                        <button className="menu__item">Exit</button>
                    </div>
                </Animated>);
        }

        return element;
    }
}
