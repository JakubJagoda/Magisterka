import * as React from "react";
import './menu-style';
import {Link} from 'react-router';
import $ from '../../third-party/jquery-fix';

enum MENU_STATES {
    ENTERING_ANIMATION
}

interface IMenuComponentState {
    menuState: MENU_STATES;
}

export default class Menu extends React.Component<{},IMenuComponentState> {
    constructor() {
        super();

        this.state = {
            menuState: MENU_STATES.ENTERING_ANIMATION
        };
    }

    render() {
        let menuContents: JSX.Element;

        switch (this.state.menuState) {
            case MENU_STATES.ENTERING_ANIMATION:
                menuContents = this.renderEnteringAnimation();
                break;
        }

        return (
            <div className="menu">
                {menuContents}
                {/*<Link to="/game"><button className="menu__item">New Game</button></Link>*/}
                {/*<Link to="/instructions"><button className="menu__item">Instructions</button></Link>*/}
                {/*<Link to="/exit"><button className="menu__item">Exit</button></Link>*/}
            </div>
        );
    }

    private renderEnteringAnimation():JSX.Element {
        return (
            <h1 className="menu__game-title" data-anim-delay={3000} data-anim-length={200}
                data-anim-style-after={'{"width": "auto", "height": "auto", "transform": "scale(0.5) translateY(-50%)"}'}
                ref={el=>this.animateTitleElement(el)}>
                <span className="menu__game-title--caption-truth" data-anim-delay={0} data-anim-length={200}
                      data-anim-style-after={'{"right": 0}'}
                      ref={el=>this.animateTitleElement(el)}>TRUTH</span>
                <span className="menu__game-title--caption-or" data-anim-delay={800} data-anim-length={200}
                      data-anim-style-after={'{"top": 0}'}
                      ref={el=>this.animateTitleElement(el)}>OR</span>
                <span className="menu__game-title--caption-bunk" data-anim-delay={1600} data-anim-length={200}
                      data-anim-style-after={'{"left": 0}'}
                      ref={el=>this.animateTitleElement(el)}>BUNK</span>
            </h1>
        );
    }

    private animateTitleElement(element:HTMLElement):void {
        const $element = $(element);

        setTimeout(() => {
            if ($element.data('anim-length')) {
                $element.css('transition', `all ${$element.data('anim-length')}ms ease-in`);
            }

            // why this is automatically converted to an object, if it was written as a string?
            $element.css($element.data('anim-style-after'));
        }, $element.data('anim-delay'));
    }
}
