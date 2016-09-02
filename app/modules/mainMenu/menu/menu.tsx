import * as React from "react";
import {Link} from 'react-router';

export default class Menu extends React.Component<{},{}> {
    render() {
        return (
            <div className="menu">
                <Link to="/game"><button className="menu__item">New Game</button></Link>
                <Link to="/instructions"><button className="menu__item">Instructions</button></Link>
                <Link to="/exit"><button className="menu__item">Exit</button></Link>
            </div>
        );
    }
}
