import {IDispatcherAction} from '../flux/dispatcher';
import {IHighScoresResponse} from "../api/api";

export class HighScoresLoadedAction implements IDispatcherAction {
    constructor(public highScores: IHighScoresResponse) {
    }
}