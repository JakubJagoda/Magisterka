import * as React from "react";
import './menu.style';
import {Link} from 'react-router';
import Animated from '../animated/animated';
import userStore from '../user/userStore';
import RouterContext from 'react-router/lib/RouterContext';

interface IMenuState {
    loading: boolean;
}

interface IMenuProps extends RouterContext.RouterContextProps {
    loading?: boolean;
}

export default class Menu extends React.Component<IMenuProps,IMenuState> {
    private onUserStoreChangeBound = this.onUserStoreChange.bind(this);

    constructor(...props) {
        super(...props);

        this.state = {
            loading: !userStore.getUserData().deviceID
        };

        userStore.addListener(this.onUserStoreChangeBound);
    }

    componentWillUnmount() {
        userStore.removeListener(this.onUserStoreChangeBound);
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
                }} initialStyle={{width: '100vw', height: '100vh'}} skipIf={Boolean(this.props.location.query.skipAnimation)}>
                <div className="menu__game-title">
                    <Animated animations={{
                              delay: 0,
                              length: 200,
                              style: {
                                  right: 0
                              }
                          }} initialStyle={{right: '-100%'}} skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src={require('../../static/img/logo-truth.png')} />
                    </Animated>
                    <Animated animations={{
                              delay: 800,
                              length: 200,
                              style: {
                                  top: 0
                              }
                          }} initialStyle={{top: '100%'}} skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src={require('../../static/img/logo-or.png')} />
                    </Animated>
                    <Animated animations={{
                              delay: 1600,
                              length: 200,
                              style: {
                                  left: 0
                              }
                          }} initialStyle={{left: '-100%'}} skipIf={Boolean(this.props.location.query.skipAnimation)}>
                        <img src={require('../../static/img/logo-bunk.png')} />
                    </Animated>
                </div>
            </Animated>
        );
    }

    private renderButtonsAnimation(): JSX.Element {
        let inner;

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
                {userStore.getUserData().userName && <div className="menu__signed-in">Signed in as <strong>{userStore.getUserData().userName}</strong></div>}
                <Link to="/game">
                    <button className="menu__item">New Game</button>
                </Link>
                <Link to="/register">
                    <button className="menu__item">Register</button>
                </Link>
                <Link to="/signin">
                    <button className="menu__item">Sign in</button>
                </Link>
                <button className="menu__item">Exit</button>
            </div>);
        }

        return (<Animated animations={{
            delay: 3000,
            length: 500,
            style: {
                top: '50%'
            },
            easing: 'ease-out',
        }} initialStyle={{top: '100%'}} skipIf={Boolean(this.props.location.query.skipAnimation)}>
            {inner}
        </Animated>);
    }
}
