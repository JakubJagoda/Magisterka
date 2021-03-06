import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, Redirect, hashHistory} from 'react-router';

import Animated from './modules/animated/animated';

import Menu from './modules/menu/menu';
import Scene from './modules/scene/scene';
import HighScores from './modules/highScores/highScores';
import RegisterForm from './modules/registerForm/registerForm';
import * as RegisterDevice from './modules/registerDevice/registerDevice';
import Sounds from './modules/sounds/sounds';
import {loadPNGAssets} from './modules/imagesPreloader/imagesPreloader';
import {VERSION} from 'app-constants';

import './static/stylesheets/style';

import StadiumLights from './modules/stadiumLights/stadiumLights';
import SignInForm from './modules/signInForm/signInForm';

if (parent) {
    //window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] = parent['__REACT_DEVTOOLS_GLOBAL_HOOK__'];
    window['React'] = parent['React'] = React;
}

const currentVersion = localStorage.getItem('tgame.version');
if (currentVersion !== VERSION) {
    localStorage.clear();
    localStorage.setItem('tgame.version', VERSION);
}

const wrapper = document.createElement('div');
wrapper.classList.add('app-wrapper');

const topLevelApp = (
    <div className="app-wrapper">
        <Animated animations={[
            {
                length: 4000,
                style: {
                    opacity: 1
                },
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                property: 'opacity'
            }
        ]} initialStyle={{opacity: 0}}>
        <StadiumLights className="lights1"
                       countX={5} countY={3} startX={20} startY={20} radius={20} margin={20} shadowBlur={20}
        />
        </Animated>
        <Animated animations={[
            {
                length: 4000,
                style: {
                    opacity: 1
                },
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                property: 'opacity'
            }
        ]} initialStyle={{opacity: 0}}>
        <StadiumLights className="lights2"
                       countX={5} countY={3} startX={20} startY={20} radius={20} margin={20} shadowBlur={20}
        />
        </Animated>
        <Router history={hashHistory}>
            <Route path="/" component={Menu}/>
            <Route path="/menu" component={Menu}/>
            <Route path="/game" component={Scene}/>
            <Route path="/highscores" component={HighScores}/>
            <Route path="/register" component={RegisterForm}/>
            <Route path="/signin" component={SignInForm} />
            <Redirect from="*" to="/" />
        </Router>
    </div>
);

document.body.appendChild(wrapper);

RegisterDevice.registerDevice();

Promise.all([
    Sounds.initializeSamples(),
    loadPNGAssets()
]).then(() => {
    ReactDOM.render(topLevelApp, document.body);
});