import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, hashHistory} from 'react-router';

import Menu from "./modules/mainMenu/menu/menu";
import Scene from "./modules/scene/scene";

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Menu}/>
        <Route path="/menu" component={Menu}/>
        <Route path="/game" component={Scene}/>
    </Router>,
    document.body
);
