import Dispatcher from '../flux/dispatcher';

import * as Api from '../api/api';
import * as UserActions from '../user/userActions';
import userStore from '../user/userStore';

export async function registerDevice(): Promise<string> {
    if (!isDeviceRegistered()) {
        const deviceID = await Api.registerDevice(navigator.userAgent);

        Dispatcher.handleServerAction({
            action: new UserActions.DeviceRegisteredAction(deviceID)
        });
    }

    return getDeviceID();
}

export function getDeviceID(): string {
    return userStore.getUserData().deviceID;
}

export function isDeviceRegistered(): boolean {
    return !!userStore.getUserData().deviceID;
}
