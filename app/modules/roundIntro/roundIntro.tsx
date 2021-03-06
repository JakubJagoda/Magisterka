import * as React from 'react';
import Animated from "../animated/animated";

import './roundIntro.style';
import {default as Sounds, ESoundSample} from "../sounds/sounds";

interface IRoundIntroProps {
    currentRound: number;
    onIntroFaded: () => void;
}

export default class RoundIntro extends React.Component<IRoundIntroProps,{}> {
    render() {
        const humanizedRoundNumber = this.props.currentRound + 1;

        return (
            <Animated animations={[
                {
                    delay: 3500,
                    length: 500,
                    style: {
                        transform: 'scale(0.5)',
                        opacity: 0
                    },
                    easing: 'linear',
                    callback: this.props.onIntroFaded
                }
            ]}>
            <div className="round-intro">
                <Animated animations={[
                    {
                        delay: 500,
                        length: 200,
                        style: {
                            left: 0
                        },
                        callback: () => {
                            Sounds.playSound(ESoundSample.ROUND_INTRO);
                            Sounds.playSound(ESoundSample.SWOOSH);
                        }
                    }
                ]}>
                    <div className="round-intro__round"><img src='./static/img/round.png' /></div>
                </Animated>
                <Animated animations={[
                    {
                        delay: 800,
                        length: 200,
                        style: {
                            top: 0
                        },
                        callback: () => {
                            Sounds.playSound(ESoundSample.SWOOSH);
                        }
                    }
                ]}>
                    <div className="round-intro__number"><img src={`./static/img/${humanizedRoundNumber}.png`}/></div>
                </Animated>
            </div>
            </Animated>
        );
    }
}