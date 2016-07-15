import * as React from "react";
import MenuItem from '../menuItem/menuItem';

export default class Menu extends React.Component<{},{}> {
    render() {
        return (
            <div className="menu">
                <MenuItem className="menu__item" text="New game" clickHandler={() => alert("1")}/>
                <MenuItem className="menu__item" text="Instructions" clickHandler={() => alert("2")}/>
                <MenuItem className="menu__item" text="Exit" clickHandler={() => alert("3")}/>
            </div>
        )
    }
}
