import * as React from "react";

export interface MenuItemProps extends React.HTMLAttributes {
    text: string;
    clickHandler: Function;
}

export default class MenuItem extends React.Component<MenuItemProps, {}> {
    render() {
        return <button className={this.props.className}
                       onClick={() => this.props.clickHandler(this)}>{this.props.text}</button>
    }
}
