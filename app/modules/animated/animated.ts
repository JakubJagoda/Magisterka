import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

interface ICSSProps {
    [prop:string]: string|number;
}

interface IAnimationDescriptor {
    delay?: number;
    length: number;
    easing?: string;
    style: ICSSProps;
    property?: string;
    callback?: Function;
    isDisabled?: boolean;
}

interface IAnimatedProps {
    animations: IAnimationDescriptor|IAnimationDescriptor[];
    initialStyle?: ICSSProps;
    finalStyle?: ICSSProps;
}

export default class Animated extends React.Component<IAnimatedProps,{}> {
    static defaultProps: IAnimatedProps = {
        animations: [],
        initialStyle: {}
    };

    private static isDisabled = false;

    static disableAnimations() {
        Animated.isDisabled = true;
    }

    constructor(props) {
        super(props);

        if (Animated.isArrayOfAnimations(this.props.animations)) {
            for (const animation of this.props.animations) {
                Animated.setDefaultMissingAnimationProps(animation);
            }
        } else {
            const animation = this.props.animations;
            Animated.setDefaultMissingAnimationProps(animation);
        }
    }

    render() {
        return React.cloneElement(React.Children.only(this.props.children), {ref: this.createAnimations.bind(this)});
    }

    private static setDefaultMissingAnimationProps(animation: IAnimationDescriptor) {
        animation.easing = animation.easing || 'ease-in';
        animation.delay = animation.delay || 0;
        animation.property = animation.property || 'all';
        animation.isDisabled = animation.isDisabled || false;
    }

    private createAnimations(element:HTMLElement) {
        if (!element) {
            return;
        }

        const $element = $(ReactDOM.findDOMNode(element));

        $element.css(this.props.initialStyle);

        if (Animated.isArrayOfAnimations(this.props.animations)) {
            for (const animation of this.props.animations) {
                Animated.applyAnimation($element, animation, this.props.finalStyle);
            }
        } else {
            const animation = this.props.animations;
            Animated.applyAnimation($element, animation, this.props.finalStyle);
        }
    }

    private static applyAnimation($element:JQuery, animation:IAnimationDescriptor, finalStyle: ICSSProps) {
        if (Animated.isDisabled || animation.isDisabled) {
            animation.delay = 0;
            animation.length = 0;
        }

        setTimeout(() => {
            if (animation.length) {
                $element.css('transition', `${animation.property} ${animation.length}ms ${animation.easing}`);
            }

            $element.css(animation.style);

            if (finalStyle) {
                setTimeout(() => $element.css(finalStyle), animation.length);
            }

            if (!animation.callback) {
                return;
            } else if (animation.length) {
                setTimeout(animation.callback, animation.length);
            } else {
                animation.callback();
            }
        }, animation.delay);
    }

    private static isArrayOfAnimations(animations: IAnimationDescriptor|IAnimationDescriptor[]): animations is IAnimationDescriptor[] {
        return Array.isArray(animations);
    }
}