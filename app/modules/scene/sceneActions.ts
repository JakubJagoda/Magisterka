import {IDispatcherAction} from "../flux/dispatcher";
export class SetPlayerNameAction implements IDispatcherAction {
    constructor(public name:string){}
}