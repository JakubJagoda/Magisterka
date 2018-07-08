import {hashHistory} from 'react-router';
import * as React from 'react';
import "./highScores.style";
import {default as highScoresStore} from './highScoresStore';
import Animated from "../animated/animated";
import * as Api from '../api/api';
import dispatcher from "../flux/dispatcher";
import {HighScoresLoadedAction} from "./highScoresActions";
import {IHighScoresEntry, IHighScoresResponse} from "../api/api";
import Button from "../shared/button/button";

interface IHighScoresState {
    loading: boolean;
    highScores: IHighScoresResponse
}

export default class HighScores extends React.Component<{}, IHighScoresState> {
    constructor(props) {
        super(props);

        highScoresStore.addListener(this.onHighScoresStoreChanged.bind(this));

        this.state = {
            loading: true,
            highScores: {
                single: [],
                total: []
            }
        };

        Api.getHighScores().then(highScores => {
            dispatcher.handleServerAction({
                action: new HighScoresLoadedAction(highScores)
            });
        });
    }

    render() {
        if (this.state.loading) {
            return this.renderLoading();
        } else {
            return this.renderHighScores();
        }
    }

    private renderLoading() {
        return (
            <div className="high-scores" key="LOADING">Loading...</div>
        );
    }

    private renderHighScores() {
        let highScoresElement: JSX.Element;

        if (this.state.highScores.single.length !== 0) {

            highScoresElement = (
                <div>
                    <h1>Single game high score:</h1>
                    {this.getScoresTable(this.state.highScores.single)}
                </div>
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
                    <img src='./static/img/high-scores.png' />
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
                    <Button className="button" onClick={HighScores.goBack}>&laquo; Back</Button>
                </Animated>
            </div>
        )
    }

    // @todo this was meant to display two tables, but some space needs to be found for that
    private getScoresTable(scores: IHighScoresEntry[]): JSX.Element {
        return (
            <table className="high-scores__table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Highest cash</th>
                </tr>
                </thead>
                <tbody>
                {scores.map((highScoreEntry, i) => {
                    return (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{highScoreEntry.name}</td>
                            <td>${highScoreEntry.score}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }

    private onHighScoresStoreChanged() {
        const storeState = highScoresStore.getHighScoresState();

        this.setState(Object.assign({}, this.state, {
            loading: false,
            highScores: storeState
        }));
    }

    private static goBack() {
        hashHistory.replace('/?skipAnimation=true');
    }
}