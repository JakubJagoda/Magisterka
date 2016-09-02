import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import store from './store';

import Menu from "./modules/mainMenu/menu/menu";
import Scene from "./modules/scene/scene";

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Menu}/>
            <Route path="/menu" component={Menu}/>
            <Route path="/game" component={Scene}/>
        </Router>
    </Provider>,
    document.body
);
