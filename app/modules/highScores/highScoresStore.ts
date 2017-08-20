import Store from '../flux/store';
import {IDispatcherPayload} from '../flux/dispatcher';
import {HighScoresLoadedAction} from './highScoresActions';
import {IHighScoresResponse} from "../api/api";

class HighScoresStore extends Store {
    private highScores: IHighScoresResponse = {
        total: [],
        single: []
    };

    protected onDispatch(payload: IDispatcherPayload): void {
        const action = payload.action;

        if (action instanceof HighScoresLoadedAction) {
            this.highScores = action.highScores;
        } else {
            return;
        }

        this.emitChange();
    }

    public getHighScoresState():IHighScoresResponse {
        return {
            single: this.highScores.single.slice(),
            total: this.highScores.total.slice()
        };
    }
}

const highScoresStore = new HighScoresStore();
export default highScoresStore;