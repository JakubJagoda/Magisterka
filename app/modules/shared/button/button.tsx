import * as React from 'react';
import classnames from 'classnames';
import Sounds, {ESoundSample} from '../../sounds/sounds';

import './button.scss';

export enum EButtonType {
    NORMAL='normal',
    OK='ok',
    WARN='warn'
}

interface IButtonProps {
    onClick?: (...args) => any;
    buttonType?: EButtonType;
}

const Button: React.SFC<IButtonProps & React.HTMLAttributes<HTMLButtonElement>> = (props) => {
    return (
        <button className={classnames('button', `button--${props.buttonType || EButtonType.NORMAL}`, props.className)}
                onClick={(...args) => {
                    Sounds.playSound(ESoundSample.BTN_CLICK);
                    return props.onClick && props.onClick(...args);
                }}
                onMouseEnter={() => {
                    Sounds.playSound(ESoundSample.BTN_HOVER)
                }}>
            {props.children}
        </button>
    )
};

export default Button;