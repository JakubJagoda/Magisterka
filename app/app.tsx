import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, Redirect, hashHistory} from 'react-router';

import Animated from './modules/animated/animated';

import Menu from "./modules/menu/menu";
import Scene from "./modules/scene/scene";
import HighScores from "./modules/highScores/highScores";

import './static/stylesheets/style';
import $ from './third-party/jquery-fix';

import StadiumLights from './modules/stadiumLights/stadiumLights';

if (parent) {
    //window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] = parent['__REACT_DEVTOOLS_GLOBAL_HOOK__'];
    window['React'] = parent['React'] = React;
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
            <Redirect from="*" to="/" />
        </Router>
    </div>
);

ReactDOM.render(
    topLevelApp,
    document.body
);

document.body.appendChild(wrapper);

