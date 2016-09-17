import Store from '../flux/store';
import {IDispatcherPayload} from "../flux/dispatcher";
import {SetPlayerNameAction, BeginRoundAction, RequestForBetAction} from "./sceneActions";

export const enum SCENE_STATES {
    NAME_INPUT,
    PLAYER_GREETING,
    ROUND_INTRO,
    PLACING_BET,
    QUESTION,
    QUESTION_AFTERMATHS,
    PLAYER_LOSE,
    PLAYER_WIN
}

export interface IGameState {
    playerName: string;
    playerMoney: number;
    currentGameState: SCENE_STATES;
    currentRound: number;
}

class GameStore extends Store {
    private playerName: string = '';
    private playerMoney: number = 100;
    private currentGameState: SCENE_STATES = SCENE_STATES.NAME_INPUT;
    private currentRound: number = 0;

    protected onDispatch(payload: IDispatcherPayload): void {
        const action = payload.action;

        if (action instanceof SetPlayerNameAction) {
            this.playerName = action.name;
            this.currentGameState = SCENE_STATES.PLAYER_GREETING;
        } else if (action instanceof BeginRoundAction) {
            this.currentRound = action.round;
            this.currentGameState = SCENE_STATES.ROUND_INTRO;
        } else if (action instanceof RequestForBetAction) {
            this.currentGameState = SCENE_STATES.PLACING_BET
        } else {
            return;
        }

        this.emitChange();
    }

    public getGameState():IGameState {
        return {
            playerName: this.playerName,
            playerMoney: this.playerMoney,
            currentGameState: this.currentGameState,
            currentRound: this.currentRound
        };
    }
}

const gameStore = new GameStore();
export default gameStore;