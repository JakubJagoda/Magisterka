import Dispatcher from '../flux/dispatcher';

import * as Api from '../api/api';
import * as UserActions from '../user/userActions';

let deviceID: string;
const LOCAL_STORAGE_KEY = 'tgame.deviceid';

if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
    deviceID = localStorage.getItem(LOCAL_STORAGE_KEY);
}

export async function registerDevice(): Promise<string> {
    if (!isDeviceRegistered()) {
        deviceID = await Api.registerDevice(navigator.userAgent);
        localStorage.setItem(LOCAL_STORAGE_KEY, deviceID);
    }

    Dispatcher.handleServerAction({
        action: new UserActions.DeviceRegisteredAction(deviceID)
    });

    return getDeviceID();
}

export function getDeviceID(): string {
    return deviceID;
}

export function isDeviceRegistered(): boolean {
    return !!deviceID;
}
