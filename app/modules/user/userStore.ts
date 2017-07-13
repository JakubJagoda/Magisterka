import Store from "../flux/store";
import {IDispatcherPayload} from "../flux/dispatcher";
import {DeviceRegisteredAction, LogoutUserAction, UserLoggedInAction} from "./userActions";

class UserStore extends Store {
    private userID: string;
    private userName: string;
    private deviceID: string;

    protected onDispatch(payload: IDispatcherPayload): void {
        const action = payload.action;

        if (action instanceof UserLoggedInAction) {
            this.userID = action.id;
            this.userName = action.name;
        } else if (action instanceof LogoutUserAction) {
            this.userID = null;
            this.userName = null;
        } else if (action instanceof DeviceRegisteredAction) {
            this.deviceID = action.deviceID;
        } else {
            return;
        }

        this.emitChange();
    }

    public getUserData() {
        return {
            userID: this.userID,
            userName: this.userName,
            deviceID: this.deviceID
        };
    }
}

const userStore = new UserStore();
export default userStore;