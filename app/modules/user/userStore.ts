import Store from "../flux/store";
import {IDispatcherPayload} from "../flux/dispatcher";
import {DeviceRegisteredAction, LogoutUserAction, UserLoggedInAction} from "./userActions";

const LOCAL_STORAGE_KEY = 'tgame.userData';

interface ILocalStorageEntry {
    userID: string;
    userName: string;
    deviceID: string;
}

class UserStore extends Store {
    private userID: string;
    private userName: string;
    private deviceID: string;

    constructor() {
        super();

        this.syncStoreWithLocalStorage();
    }

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

        this.syncLocalStorageWithStore();
        this.emitChange();
    }

    public getUserData() {
        return {
            userID: this.userID,
            userName: this.userName,
            deviceID: this.deviceID
        };
    }

    private syncStoreWithLocalStorage() {
        const valueFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if (UserStore.isEntryNotNull(valueFromLocalStorage)) {
            this.userID = valueFromLocalStorage.userID;
            this.userName = valueFromLocalStorage.userName;
            this.deviceID = valueFromLocalStorage.deviceID;
        } else {
            this.userID = '';
            this.userName = '';
            this.deviceID = '';
        }
    }

    private syncLocalStorageWithStore() {
        const {userID, userName, deviceID} = this;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            userID,
            userName,
            deviceID
        }));
    }

    private static isEntryNotNull(obj: any): obj is ILocalStorageEntry {
        return obj !== null;
    }
}

const userStore = new UserStore();
export default userStore;