import * as React from 'react';
import * as ReactDOM from 'react-dom';
import $ from 'jquery';

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
    after?: string;
    name?: string;
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
    private static done: string[] = [];
    private static after = new Map<string, Array<() => void>>();
    private animationsRan = false;

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
        if (!element || this.animationsRan) {
            return;
        }

        this.animationsRan = true;

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

        if (animation.name && !Animated.after.has(animation.name)) {
            Animated.after.set(animation.name, []);
        }

        let callback;
        if (animation.callback) {
            callback = () => {
                if (animation.name) {
                    Animated.done.push(animation.name);
                }

                if (animation.name && Animated.after.has(animation.name)) {
                    for (const delayedAnimation of Animated.after.get(animation.name)) {
                        delayedAnimation();
                    }
                }

                animation.callback();
            }
        } else {
            callback = () => {
                if (animation.name) {
                    Animated.done.push(animation.name);
                }

                if (animation.name && Animated.after.has(animation.name)) {
                    for (const delayedAnimation of Animated.after.get(animation.name)) {
                        delayedAnimation();
                    }
                }
            }
        }

        const animationFn = () => {
            if (animation.length) {
                $element.css('transition', `${animation.property} ${animation.length}ms ${animation.easing}`);
            }

            $element.css(animation.style);

            if (finalStyle) {
                setTimeout(() => $element.css(finalStyle), animation.length);
            }

            if (animation.length) {
                setTimeout(callback, animation.length);
            } else {
                callback();
            }
        };

        if (animation.after && Animated.done.indexOf(animation.after) !== -1) {
            setTimeout(animationFn, animation.delay);
        } else if (animation.after) {
            Animated.after.get(animation.after).push(() => {
                setTimeout(animationFn, animation.delay);
            });
        } else {
            setTimeout(animationFn, animation.delay);
        }
    }

    private static isArrayOfAnimations(animations: IAnimationDescriptor|IAnimationDescriptor[]): animations is IAnimationDescriptor[] {
        return Array.isArray(animations);
    }
}