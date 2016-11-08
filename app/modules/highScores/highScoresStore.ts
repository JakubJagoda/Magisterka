import Store from '../flux/store';
import {IDispatcherPayload} from '../flux/dispatcher';
import {SaveHighScoreAction} from './highScoresActions';

export interface IHighScoreState {
    highScores: HighScoreEntry[];
}

interface HighScoreEntry {
    playerName: string;
    round: number;
    cash: number;
    score: number;
}

class HighScoresStore extends Store {
    private highScores: HighScoreEntry[];
    private static readonly MAX_SCORES_KEPT = 10;

    constructor() {
        super();
        this.highScores = JSON.parse(localStorage.getItem(HighScoresStore.LOCAL_STORAGE_KEY)) || [];
    }

    private static LOCAL_STORAGE_KEY = 'scores';

    protected onDispatch(payload: IDispatcherPayload): void {
        const action = payload.action;

        if (action instanceof SaveHighScoreAction) {
            this.highScores.push({
                playerName: action.playerName,
                round: action.round,
                cash: action.money,
                score: action.round * 1300 + action.money
            });

            this.highScores.sort((a, b) => b.score - a.score);

            if (this.highScores.length > HighScoresStore.MAX_SCORES_KEPT) {
                this.highScores.pop();
            }

            localStorage.setItem(HighScoresStore.LOCAL_STORAGE_KEY, JSON.stringify(this.highScores));
        } else {
            return;
        }

        this.emitChange();
    }

    public getHighScoreState():IHighScoreState {
        return {
            highScores: this.highScores.slice()
        };
    }
}

const highScoresStore = new HighScoresStore();
export default highScoresStore;