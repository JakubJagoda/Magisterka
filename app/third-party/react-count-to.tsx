/* modified version of React-Count-To from https://github.com/MicheleBertoli/react-count-to
   credits for original library go to Michele Bertoli */

import React from 'react';

interface ICountToProps {
    from?: number,
    to: number,
    speed: number,
    delay?: number,
    initialDelay?: number,
    onComplete?: () => void,
    digits?: number,
    className?: string
}

interface ICountToState {
    counter: number;
}

const CountTo = React.createClass<ICountToProps, ICountToState>({

    propTypes: {
        from: React.PropTypes.number,
        to: React.PropTypes.number.isRequired,
        speed: React.PropTypes.number.isRequired,
        delay: React.PropTypes.number,
        initialDelay: React.PropTypes.number,
        onComplete: React.PropTypes.func,
        digits: React.PropTypes.number,
        className: React.PropTypes.string
    },

    getInitialState() {
        return {
            counter: this.props.from || 0
        };
    },

    componentDidMount() {
        setTimeout(() => {
            this.start(this.props);
        }, this.props.initialDelay || 0);
    },

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.start(nextProps);
        }, nextProps.initialDelay || 0);
    },

    componentWillUnmount() {
        this.clear();
    },

    start(props) {
        this.clear();
        this.setState(this.getInitialState(), () => {
            const delay = this.props.delay || 100;
            this.loopsCounter = 0;
            this.loops = Math.ceil(props.speed / delay);
            this.increment = (props.to - this.state.counter) / this.loops;
            this.interval = setInterval(this.next.bind(this, props), delay);
        });
    },

    next(props) {
        if (this.loopsCounter < this.loops) {
            this.loopsCounter++;
            this.setState({
                counter: this.state.counter + this.increment
            });
        } else {
            this.clear();
            if (props.onComplete) {
                props.onComplete();
            }
        }
    },

    clear() {
        clearInterval(this.interval);
    },

    render() {
        return (
            <span className={this.props.className}>
        {this.state.counter.toFixed(this.props.digits)}
        </span>
        );
    }

});

export default CountTo;
