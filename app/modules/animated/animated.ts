import React from 'react';
import $ from '../../third-party/jquery-fix';

interface ICSSProps {
    [prop:string]: string|number;
}

interface IAnimationDescriptor {
    delay: number;
    length?: number;
    easing?: string;
    style: ICSSProps;
}

interface IAnimatedProps {
    animations: IAnimationDescriptor|IAnimationDescriptor[];
    initialStyle?: ICSSProps;
}

export default class Animated extends React.Component<IAnimatedProps,{}> {
    static defaultProps: IAnimatedProps = {
        animations: [],
        initialStyle: {}
    };

    constructor(props) {
        super(props);
        this.props = props;

        if (Animated.isArrayOfAnimations(this.props.animations)) {
            for (const animation of this.props.animations) {
                animation.easing = animation.easing || 'ease-in';
            }
        } else {
            const animation = this.props.animations;
            animation.easing = animation.easing || 'ease-in';
        }
    }

    render() {
        return React.cloneElement(React.Children.only(this.props.children), {ref: this.createAnimations.bind(this)});
    }

    private createAnimations(element:HTMLElement) {
        const $element = $(element);

        $element.css(this.props.initialStyle);

        if (Animated.isArrayOfAnimations(this.props.animations)) {
            for (const animation of this.props.animations) {
                Animated.applyAnimation($element, animation);
            }
        } else {
            const animation = this.props.animations;
            Animated.applyAnimation($element, animation);
        }
    }

    private static applyAnimation($element:JQuery, animation:IAnimationDescriptor) {
        setTimeout(() => {
            if (animation.length) {
                $element.css('transition', `all ${animation.length}ms ${animation.easing}`);
            }

            $element.css(animation.style);
        }, animation.delay);
    }

    private static isArrayOfAnimations(animations: IAnimationDescriptor|IAnimationDescriptor[]): animations is IAnimationDescriptor[] {
        return Array.isArray(animations);
    }
}