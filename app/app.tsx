import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, hashHistory} from 'react-router';

import Menu from "./modules/menu/menu";
import Scene from "./modules/scene/scene";

import './static/stylesheets/style';
import $ from './third-party/jquery-fix';

const wrapper = document.createElement('div');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Menu}/>
        <Route path="/menu" component={Menu}/>
        <Route path="/game" component={Scene}/>
    </Router>,
    wrapper
);

document.body.appendChild(wrapper);

$(document).ready(() => {

    // ($(document.body) as any).pow({
    //     rays: 7,
    //     bgColorStart: 'hsl(210, 100%, 90%)',
    //     rayColorStart: 'hsl(210, 100%, 97%)',
    //     bgColorEnd: 'hsl(210, 100%, 60%)',
    //     rayColorEnd: 'hsl(210, 100%, 80%)',
    //     originX: '60%',
    //     originY: '40%'
    // });
});

