import React from 'react';
import Animated from "../animated/animated";

import './roundIntro-style';

interface IRoundIntroProps {
    currentRound: number;
}

export default class RoundIntro extends React.Component<IRoundIntroProps,{}> {
    render() {
        return (
            <Animated animations={[
                {
                    delay: 1500,
                    length: 500,
                    style: {
                        transform: 'scale(0.5)',
                        opacity: 0
                    },
                    easing: 'linear'
                }
            ]}>
            <div className="round-intro">
                <Animated animations={[
                    {
                        delay: 500,
                        length: 200,
                        style: {
                            left: 0
                        }
                    }
                ]}>
                    <div className="round-intro__round"><img src="static/img/round.png" /></div>
                </Animated>
                <Animated animations={[
                    {
                        delay: 800,
                        length: 200,
                        style: {
                            top: 0
                        }
                    }
                ]}>
                    <div className="round-intro__number"><img src={`static/img/${this.props.currentRound}.png`}/></div>
                </Animated>
            </div>
            </Animated>
        );
    }
}