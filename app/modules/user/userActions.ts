import {IDispatcherAction} from "../flux/dispatcher";

export class UserLoggedInAction implements IDispatcherAction {
    constructor(public id: string, public name: string) {}
}

export class LogoutUserAction implements IDispatcherAction {}

export class DeviceRegisteredAction implements IDispatcherAction {
    constructor(public deviceID: string) {}
}