import {hashHistory} from 'react-router';
import React from 'react';
import "./highScores.style";
import {default as highScoresState} from './highScoresStore';
import Animated from "../animated/animated";

export default class HighScores extends React.Component<{},{}> {
    render() {
        const highScores = highScoresState.getHighScoreState()
            .highScores
            .slice(0, 10)
            .sort((a, b) => b.score - a.score);

        let highScoresElement: JSX.Element;

        if (highScores.length) {
            highScoresElement = (
                <table className="high-scores__table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Round</th>
                            <th>Cash</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                    {highScores.map((highScoreEntry, i) => {
                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{highScoreEntry.playerName}</td>
                                <td>{highScoreEntry.round}</td>
                                <td>${highScoreEntry.cash}</td>
                                <td>{highScoreEntry.score}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            );
        } else {
            highScoresElement = (
                <h1>No high scores! Come on, give it a shot!</h1>
            );
        }

        return (
            <div className="high-scores">
                <Animated animations={[
                    {
                        length: 400,
                        style: {
                            top: 0
                        }
                    }
                ]} initialStyle={{
                    top: '-100%',
                    position: 'relative'
                }}>
                    <img src="static/img/high-scores.png" />
                </Animated>
                <Animated animations={[
                    {
                        length: 400,
                        style: {
                            left: 0
                        }
                    }
                ]} initialStyle={{
                    left: '100%',
                    position: 'relative'
                }}>
                    {highScoresElement}
                </Animated>
                <Animated animations={[
                    {
                        length: 400,
                        style: {
                            bottom: 0
                        }
                    }
                ]} initialStyle={{
                    bottom: '-100%',
                    position: 'relative'
                }}>
                    <button className="button" onClick={HighScores.goBack}>&laquo; Back</button>
                </Animated>
            </div>
        )
    }

    private static goBack() {
        hashHistory.replace('/');
    }
}