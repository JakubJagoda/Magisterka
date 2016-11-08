import {IDispatcherAction} from '../flux/dispatcher';

export class SaveHighScoreAction implements IDispatcherAction {
    constructor(public playerName: string, public round: number, public money: number) {
    }
}