import * as React from "react";
import './menu-style';
import {Link} from 'react-router';
import Animated from '../animated/animated';

export default class Menu extends React.Component<{},{}> {
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
                        transform: 'scale(0.5) translateY(-125%)'
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

    private renderButtonsAnimation() {
        return (
            <Animated animations={{
                delay: 3000,
                length: 500,
                style: {
                    top: '50%'
                },
                easing: 'ease-out'
            }} initialStyle={{top: '100%'}}>
                <div className="menu__buttons">
                    <Link to="/game">
                        <button className="menu__item">New Game</button>
                    </Link>
                    <Link to="/instructions">
                        <button className="menu__item">Instructions</button>
                    </Link>
                    <Link to="/exit">
                        <button className="menu__item">Exit</button>
                    </Link>
                </div>
            </Animated>
        )
    }
}
