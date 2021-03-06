import * as React from 'react';
import classnames from 'classnames';
import Typist from 'react-typist';

import './typistModal.style';
import {ESoundSample, default as Sounds} from "../sounds/sounds";

interface ITypistModalProps {
    text?: string | JSX.Element;
    typistProps?: {
        [prop:string]: any
    }
    className?: string;
}

interface ITypistModalState {
    childrenVisible: boolean;
}

export default class TypistModal extends React.Component<ITypistModalProps,ITypistModalState> {
    private key = Math.random();

    constructor(props: ITypistModalProps) {
        super(props);

        this.state = {
            childrenVisible: false
        };
    }

    render() {
        return (
            <div className={classnames("typist-modal-container", this.props.className)}>
                <Typist className="typist-modal-container__text" typing={1} stdTypingDelay={0}
                        cursor={{show: false}}
                        onCharacterTyped={() => Sounds.playSound(ESoundSample.CHARACTER_TYPED)}
                        onTypingDone={() => this.setState(Object.assign(this.state, {childrenVisible: true}))}
                        {...this.props.typistProps}>
                    <span key={this.key}>{this.props.text}</span>
                </Typist>
                {this.renderChildren()}
            </div>
        );
    }

    private renderChildren() {
        const childrenClassNames = classnames('typist-modal', {
            'typist-modal--hidden': !this.state.childrenVisible
        });

        return (
            <div className={childrenClassNames}>
                {this.props.children}
            </div>
        );
    }
}