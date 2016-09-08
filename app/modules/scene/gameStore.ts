import Store from '../flux/store';
import {IDispatcherPayload} from "../flux/dispatcher";
import {SetPlayerNameAction} from "./sceneActions";

class GameStore extends Store {
    private playerName: string = '';

    protected onDispatch(payload: IDispatcherPayload): void {
        const action = payload.action;

        if (action instanceof SetPlayerNameAction) {
            this.playerName = action.name;
        } else {
            return;
        }

        this.emitChange();
    }

    public getGameState() {
        return {
            playerName: this.playerName
        };
    }
}

const gameStore = new GameStore();
export default gameStore;