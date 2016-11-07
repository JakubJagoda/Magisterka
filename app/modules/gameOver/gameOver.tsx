import React from 'react';
import Animated from "../animated/animated";
import CountTo from "../../third-party/react-count-to";

import './gameOver.style';

interface IGameOverProps {
    didPlayerWin: boolean;
    playerMoney: number;
    onScoreShown: () => void;
}

export default class GameOver extends React.Component<IGameOverProps,{}> {
    render() {
        return (
            <div className="game-over">
                <Animated animations={{
                    length: 1000,
                    style: {
                        opacity: 1,
                        transform: 'none'
                    }
                }} initialStyle={{
                    opacity: 0,
                    transform: 'scale(0.25)'
                }}>
                    {this.renderImageText()}
                </Animated>
                <Animated animations={{
                    delay: 2000,
                    length: 200,
                    style: {
                        opacity: 1
                    }
                }} initialStyle={{
                    opacity: 0
                }}>
                    <span className="game-over__status">
                        Your cash: $<CountTo from={0} to={this.props.playerMoney} speed={500} initialDelay={2500} delay={50}
                                           onComplete={() => setTimeout(this.props.onScoreShown, 1000)} /></span>
                </Animated>
            </div>
        )
    }

    private renderImageText(): JSX.Element {
        const src = this.props.didPlayerWin ? 'you-won' : 'you-lose';
        return (
            <img className="question-panel-buttons__result-text" src={`static/img/${src}.png`} />
        );
    }
}